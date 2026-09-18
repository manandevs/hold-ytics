/**
 * Shared plumbing for the three Polymarket APIs this app reads.
 *
 * Nothing here knows about markets, prices or trades — it only owns the base
 * URLs, the cache window and the failure policy every request inherits.
 */

export const GAMMA_API = "https://gamma-api.polymarket.com";
export const CLOB_API = "https://clob.polymarket.com";
export const DATA_API = "https://data-api.polymarket.com";
export const POLYMARKET_WEB = "https://polymarket.com";

/** How long fetched market data stays fresh, in seconds. */
export const REVALIDATE_SECONDS = 30;

/** Upper bound on `limit` so a crafted query can't ask for thousands of rows. */
export const MAX_LIMIT = 100;

/**
 * Cache window for the accuracy study. It replays hundreds of upstream calls,
 * and resolved-market history does not change, so it is cached for hours.
 */
export const ACCURACY_REVALIDATE_SECONDS = 21_600;

/**
 * Fetch and parse JSON, resolving to `null` on any failure.
 *
 * Callers turn that `null` into an empty result so one unavailable upstream
 * endpoint degrades a single panel instead of breaking the page.
 */
export async function fetchJson<T>(
  url: string,
  revalidate: number = REVALIDATE_SECONDS
): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Clamp an arbitrary number into `[min, max]`, falling back when it isn't finite. */
export function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.trunc(value), min), max);
}
