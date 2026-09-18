import {
  ACCURACY_REVALIDATE_SECONDS,
  CLOB_API,
  fetchJson,
  GAMMA_API,
} from "./client";
import type {
  AccuracyReport,
  CalibrationBucket,
  HorizonStat,
  VolumeBucket,
} from "@/types/accuracy";

/** Pages of resolved markets to pull before sampling (100 per page). */
const PAGES = 6;
/** Markets actually priced. Each costs two upstream calls. */
const SAMPLE_SIZE = 140;
/** Parallel price lookups. High enough to stay quick, low enough to be polite. */
const CONCURRENCY = 12;
/** Ignore markets too thin for their closing price to mean anything. */
const MIN_VOLUME = 10_000;
/** Ignore markets that never lived long enough for a lookback to exist. */
const MIN_DURATION_DAYS = 3;

/** Lookbacks reported on the page, shortest first. */
const HORIZONS = [
  { id: "1h", label: "1 hour", seconds: 3600 },
  { id: "4h", label: "4 hours", seconds: 4 * 3600 },
  { id: "12h", label: "12 hours", seconds: 12 * 3600 },
  { id: "1d", label: "1 day", seconds: 86_400 },
  { id: "3d", label: "3 days", seconds: 3 * 86_400 },
  { id: "30d", label: "1 month", seconds: 30 * 86_400 },
] as const;

type HorizonId = (typeof HORIZONS)[number]["id"];

/** The window pulled in one call; covers every horizon up to 3 days. */
const NEAR_WINDOW_SECONDS = 4 * 86_400;
const MONTH_SECONDS = 30 * 86_400;

interface SampleRow {
  /** 1 when the first outcome (conventionally "Yes") won, else 0. */
  won: number;
  volume: number;
  /** Price of the first outcome at each horizon; null when unavailable. */
  prices: Partial<Record<HorizonId, number>>;
}

/** Parse the API's mixed date formats to a unix timestamp in seconds. */
function toUnix(raw?: string): number | null {
  if (!raw) return null;
  const parsed = Date.parse(String(raw).replace(" ", "T").replace("+00", "Z"));
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : null;
}

/** Run `fn` over `items` with a fixed number of workers. */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        out[index] = await fn(items[index]);
      }
    })
  );

  return out;
}

interface Candidate {
  token: string;
  closedAt: number;
  openedAt: number;
  won: number;
  volume: number;
}

/** Resolved markets with a clean binary outcome and enough trading to matter. */
async function collectCandidates(): Promise<Candidate[]> {
  const pages = await Promise.all(
    Array.from({ length: PAGES }, (_, i) =>
      fetchJson<Record<string, unknown>[]>(
        `${GAMMA_API}/markets?closed=true&archived=false&limit=100&offset=${i * 100}` +
          `&order=volumeNum&ascending=false`,
        ACCURACY_REVALIDATE_SECONDS
      )
    )
  );

  const candidates: Candidate[] = [];

  for (const market of pages.flat().filter(Boolean) as Record<string, unknown>[]) {
    const closedAt = toUnix(market.closedTime as string) ?? toUnix(market.endDate as string);
    const openedAt = toUnix(market.startDate as string) ?? toUnix(market.createdAt as string);
    const volume = Number(market.volumeNum ?? 0);

    if (!closedAt || !openedAt) continue;
    if (!Number.isFinite(volume) || volume < MIN_VOLUME) continue;
    if (closedAt - openedAt < MIN_DURATION_DAYS * 86_400) continue;

    let tokens: unknown;
    let prices: unknown;
    try {
      tokens = JSON.parse((market.clobTokenIds as string) || "[]");
      prices = JSON.parse((market.outcomePrices as string) || "[]");
    } catch {
      continue;
    }
    if (!Array.isArray(tokens) || !Array.isArray(prices) || prices.length < 2) continue;

    const token = tokens[0] ? String(tokens[0]) : "";
    // A resolved binary market settles to exactly 1 and 0.
    const first = Number(prices[0]);
    const second = Number(prices[1]);
    const won = first === 1 ? 1 : second === 1 ? 0 : null;
    if (!token || won === null) continue;

    candidates.push({ token, closedAt, openedAt, won, volume });
  }

  return candidates;
}

/** Price of `token` at each horizon before it resolved. */
async function priceRow(candidate: Candidate): Promise<SampleRow | null> {
  const { token, closedAt, openedAt } = candidate;
  const needMonth = closedAt - openedAt >= MONTH_SECONDS;

  const [near, month] = await Promise.all([
    fetchJson<{ history?: { t: number; p: number }[] }>(
      `${CLOB_API}/prices-history?market=${encodeURIComponent(token)}` +
        `&startTs=${closedAt - NEAR_WINDOW_SECONDS}&endTs=${closedAt}&fidelity=10`,
      ACCURACY_REVALIDATE_SECONDS
    ),
    needMonth
      ? fetchJson<{ history?: { t: number; p: number }[] }>(
          `${CLOB_API}/prices-history?market=${encodeURIComponent(token)}` +
            `&startTs=${closedAt - MONTH_SECONDS - 5400}&endTs=${closedAt - MONTH_SECONDS + 5400}` +
            `&fidelity=10`,
          ACCURACY_REVALIDATE_SECONDS
        )
      : Promise.resolve(null),
  ]);

  const history = Array.isArray(near?.history) ? near.history : [];
  if (history.length === 0) return null;

  /** Last quote at or before `closedAt - seconds`. */
  const priceAt = (seconds: number): number | undefined => {
    const target = closedAt - seconds;
    let best: { t: number; p: number } | null = null;
    for (const point of history) {
      if (point.t <= target && (!best || point.t > best.t)) best = point;
    }
    return best ? best.p : undefined;
  };

  const prices: SampleRow["prices"] = {};
  for (const horizon of HORIZONS) {
    if (horizon.id === "30d") continue;
    const value = priceAt(horizon.seconds);
    if (value !== undefined) prices[horizon.id] = value;
  }

  const monthHistory = Array.isArray(month?.history) ? month.history : [];
  if (monthHistory.length > 0) {
    prices["30d"] = monthHistory[monthHistory.length - 1].p;
  }

  return { won: candidate.won, volume: candidate.volume, prices };
}

function statsFor(rows: SampleRow[], id: HorizonId): HorizonStat | null {
  const scored = rows.filter((row) => row.prices[id] !== undefined);
  if (scored.length === 0) return null;

  const brier =
    scored.reduce((sum, row) => sum + ((row.prices[id] as number) - row.won) ** 2, 0) /
    scored.length;
  const correct = scored.filter(
    (row) => ((row.prices[id] as number) >= 0.5 ? 1 : 0) === row.won
  ).length;

  const horizon = HORIZONS.find((h) => h.id === id);
  return {
    id,
    label: horizon?.label ?? id,
    sampleSize: scored.length,
    brier,
    accuracy: correct / scored.length,
  };
}

function calibrationFor(rows: SampleRow[], id: HorizonId): CalibrationBucket[] {
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    lower: i * 10,
    upper: (i + 1) * 10,
    n: 0,
    expectedSum: 0,
    actualSum: 0,
  }));

  for (const row of rows) {
    const price = row.prices[id];
    if (price === undefined) continue;
    const index = Math.min(9, Math.max(0, Math.floor(price * 10)));
    buckets[index].n += 1;
    buckets[index].expectedSum += price;
    buckets[index].actualSum += row.won;
  }

  return buckets.map((bucket) => ({
    lower: bucket.lower,
    upper: bucket.upper,
    sampleSize: bucket.n,
    expected: bucket.n ? bucket.expectedSum / bucket.n : 0,
    actual: bucket.n ? bucket.actualSum / bucket.n : 0,
  }));
}

/**
 * Brier score per volume quartile. Quartiles rather than fixed thresholds,
 * because Polymarket volumes span several orders of magnitude.
 */
function volumeBuckets(rows: SampleRow[], id: HorizonId): VolumeBucket[] {
  const scored = rows
    .filter((row) => row.prices[id] !== undefined)
    .sort((a, b) => a.volume - b.volume);
  if (scored.length < 8) return [];

  const size = Math.floor(scored.length / 4);
  const labels = ["Lowest 25%", "25–50%", "50–75%", "Highest 25%"];

  return labels.map((label, i) => {
    const slice = i === 3 ? scored.slice(i * size) : scored.slice(i * size, (i + 1) * size);
    const brier =
      slice.reduce((sum, row) => sum + ((row.prices[id] as number) - row.won) ** 2, 0) /
      slice.length;

    return {
      label,
      sampleSize: slice.length,
      brier,
      minVolume: slice[0]?.volume ?? 0,
      maxVolume: slice[slice.length - 1]?.volume ?? 0,
    };
  });
}

/**
 * Measure how well resolved markets predicted their own outcomes.
 *
 * Samples resolved binary markets, reads each one's price at several points
 * before it closed, and scores those prices against what actually happened.
 * Every figure on the accuracy page comes from this one report.
 */
export async function getAccuracyReport(): Promise<AccuracyReport | null> {
  const candidates = await collectCandidates();
  if (candidates.length === 0) return null;

  // Even stride over the volume-sorted pool, so the sample spans the whole
  // range instead of only the largest markets.
  const stride = Math.max(1, Math.floor(candidates.length / SAMPLE_SIZE));
  const picked = candidates.filter((_, i) => i % stride === 0).slice(0, SAMPLE_SIZE);

  const rows = (await mapLimit(picked, CONCURRENCY, priceRow)).filter(
    (row): row is SampleRow => row !== null && row.prices["4h"] !== undefined
  );
  if (rows.length === 0) return null;

  const horizons = HORIZONS.map((h) => statsFor(rows, h.id)).filter(
    (stat): stat is HorizonStat => stat !== null
  );

  const calibration: Record<string, CalibrationBucket[]> = {};
  for (const horizon of HORIZONS) {
    if (horizons.some((h) => h.id === horizon.id)) {
      calibration[horizon.id] = calibrationFor(rows, horizon.id);
    }
  }

  const resolvedYes = rows.filter((row) => row.won === 1).length;

  return {
    sampleSize: rows.length,
    candidatePool: candidates.length,
    minVolume: MIN_VOLUME,
    horizons,
    calibration,
    volumeBuckets: volumeBuckets(rows, "4h"),
    resolution: { yes: resolvedYes, no: rows.length - resolvedYes },
  };
}
