import { Category, Market, MarketSummary, OutcomeSeries } from "@/types/market";
import { parseOutcomes, toNumber } from "@/lib/format";
import { clamp, fetchJson, GAMMA_API, MAX_LIMIT, POLYMARKET_WEB } from "./client";
import { getPriceHistory } from "./prices";

export interface GetMarketsOptions {
  limit?: number;
  offset?: number;
  /** Free-text query; routed through Polymarket's search endpoint when present. */
  query?: string;
  /** Restricts results to one category tag. */
  tagId?: number | null;
}

/**
 * Top-level categories shown in the nav. The ids are Polymarket's own tag ids
 * (resolved from /tags/slug/<slug>) and are passed straight to the API, so every
 * tab filters real data rather than re-sorting what is already loaded.
 */
export const CATEGORIES: Category[] = [
  { label: "Trending", slug: "trending", tagId: null },
  { label: "Politics", slug: "politics", tagId: 2 },
  { label: "Sports", slug: "sports", tagId: 1 },
  { label: "Crypto", slug: "crypto", tagId: 21 },
  { label: "Tech", slug: "tech", tagId: 1401 },
  { label: "Economy", slug: "economy", tagId: 100328 },
  { label: "Geopolitics", slug: "geopolitics", tagId: 100265 },
  { label: "World", slug: "world", tagId: 101970 },
  { label: "Elections", slug: "elections", tagId: 144 },
  { label: "Business", slug: "business", tagId: 107 },
  { label: "Science", slug: "science", tagId: 74 },
];

/** Resolve a category slug from the URL, falling back to the default tab. */
export function findCategory(slug?: string): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

/** A market is worth showing only if it is open and has quotable outcomes. */
function isTradeable(market: Market): boolean {
  return Boolean(market?.id && market.active && !market.closed && market.outcomes);
}

/**
 * Strip a market down to what the cards render. Upstream objects carry long
 * descriptions, token ids and nested events, none of which the list needs.
 */
function toSummary(market: Market): MarketSummary {
  return {
    id: market.id,
    question: market.question,
    image: market.image,
    // Cards show at most two outcomes, so the rest never needs serializing.
    outcomes: parseOutcomes(market.outcomes, market.outcomePrices).slice(0, 2),
    volume: market.volumeNum ?? toNumber(market.volume) ?? 0,
    endDate: market.endDate,
  };
}

function byVolumeDesc(a: MarketSummary, b: MarketSummary): number {
  return b.volume - a.volume;
}

/**
 * Search across all of Polymarket. The public search endpoint returns events,
 * so the nested markets are flattened, de-duplicated and ranked by volume.
 */
async function searchMarkets(query: string, limit: number): Promise<MarketSummary[]> {
  const url = `${GAMMA_API}/public-search?q=${encodeURIComponent(query)}&limit_per_type=${limit}`;
  const data = await fetchJson<{ events?: { markets?: Market[] }[] }>(url);
  if (!data?.events) return [];

  const seen = new Set<string>();
  const markets: MarketSummary[] = [];

  for (const event of data.events) {
    for (const market of event.markets ?? []) {
      if (!isTradeable(market) || seen.has(market.id)) continue;
      seen.add(market.id);
      markets.push(toSummary(market));
    }
  }

  return markets.sort(byVolumeDesc).slice(0, limit);
}

/**
 * Fetch open markets, ordered by 24h volume so the most active ones come first.
 * Returns an empty array when the upstream API is unavailable — callers render
 * an empty state rather than crashing the page.
 */
export async function getMarkets({
  limit = 20,
  offset = 0,
  query,
  tagId,
}: GetMarketsOptions = {}): Promise<MarketSummary[]> {
  const safeLimit = clamp(limit, 1, MAX_LIMIT, 20);
  const safeOffset = clamp(offset, 0, 10_000, 0);

  const trimmedQuery = query?.trim();
  if (trimmedQuery) return searchMarkets(trimmedQuery, safeLimit);

  const params = new URLSearchParams({
    active: "true",
    closed: "false",
    archived: "false",
    order: "volume24hr",
    ascending: "false",
    limit: String(safeLimit),
    offset: String(safeOffset),
  });

  if (tagId != null) params.set("tag_id", String(tagId));

  const data = await fetchJson<Market[]>(`${GAMMA_API}/markets?${params}`);
  if (!Array.isArray(data)) return [];

  return data.filter(isTradeable).map(toSummary);
}

/**
 * Fetch a single market by id, or `null` when it doesn't exist.
 *
 * Queried through the list endpoint on purpose: `/markets/{id}` omits the
 * `events` array, which carries the event slug, tags and comment count the
 * detail page needs.
 */
export async function getMarketById(id: string): Promise<Market | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const data = await fetchJson<Market[]>(
    `${GAMMA_API}/markets?id=${encodeURIComponent(trimmed)}`
  );
  const market = Array.isArray(data) ? data[0] : null;
  if (market?.id) return market;

  // Fall back to the by-id route in case the list query rejects the id format.
  const single = await fetchJson<Market>(
    `${GAMMA_API}/markets/${encodeURIComponent(trimmed)}`
  );
  return single?.id ? single : null;
}

/** Parse the JSON-encoded CLOB token ids attached to a market. */
export function parseTokenIds(market: Market): string[] {
  try {
    const parsed = JSON.parse(market.clobTokenIds || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Canonical Polymarket URL for a market, used for the outbound trade link. */
export function polymarketUrl(market: Market): string {
  const eventSlug = market.events?.[0]?.slug;
  return eventSlug
    ? `${POLYMARKET_WEB}/event/${eventSlug}`
    : `${POLYMARKET_WEB}/market/${market.slug}`;
}

/**
 * Other open markets sharing a tag with this one, for the sidebar. Falls back
 * to the highest-volume markets when the event carries no usable tag.
 */
export async function getRelatedMarkets(
  market: Market,
  limit = 5
): Promise<MarketSummary[]> {
  const tag = market.events?.[0]?.tags?.find((t) => Number.isFinite(Number(t.id)));
  const markets = await getMarkets({
    limit: limit + 5,
    tagId: tag ? Number(tag.id) : null,
  });

  return markets.filter((m) => m.id !== market.id).slice(0, limit);
}

export interface FeaturedMarket {
  market: Market;
  series: OutcomeSeries[];
}

/**
 * The single highest-volume open market, with a price history per outcome for
 * the headline chart. Returns `null` when nothing usable is available.
 */
export async function getFeaturedMarket(): Promise<FeaturedMarket | null> {
  const params = new URLSearchParams({
    active: "true",
    closed: "false",
    archived: "false",
    order: "volume24hr",
    ascending: "false",
    limit: "1",
  });

  const data = await fetchJson<Market[]>(`${GAMMA_API}/markets?${params}`);
  const market = Array.isArray(data) ? data[0] : null;
  if (!market?.id || !isTradeable(market)) return null;

  const outcomes = parseOutcomes(market.outcomes, market.outcomePrices);
  const tokenIds = parseTokenIds(market);

  const histories = await Promise.all(
    outcomes.map((_, i) =>
      tokenIds[i] ? getPriceHistory(tokenIds[i]) : Promise.resolve([])
    )
  );

  const series: OutcomeSeries[] = outcomes.map((outcome, i) => ({
    name: outcome.name,
    price: outcome.price,
    points: histories[i] ?? [],
  }));

  return { market, series };
}
