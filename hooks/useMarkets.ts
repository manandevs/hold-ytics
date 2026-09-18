"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MarketSummary } from "@/types/market";

/** How often the live feed is refreshed while the tab is visible, in ms. */
const POLL_INTERVAL_MS = 30_000;

interface UseMarketsOptions {
  initialMarkets?: MarketSummary[];
  limit?: number;
  query?: string;
  tagId?: number | null;
}

interface UseMarketsResult {
  markets: MarketSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Keeps a list of markets in sync with `/api/markets`.
 *
 * Server-rendered markets can be passed as `initialMarkets` so the first paint
 * needs no client request. Polling pauses while the tab is hidden and resumes
 * with an immediate refresh, so a backgrounded tab costs nothing.
 */
export function useMarkets({
  initialMarkets = [],
  limit = 20,
  query = "",
  tagId = null,
}: UseMarketsOptions = {}): UseMarketsResult {
  const [markets, setMarkets] = useState<MarketSummary[]>(initialMarkets);
  const [loading, setLoading] = useState(initialMarkets.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Tracks the in-flight request so a slow response can't overwrite a newer one.
  const abortRef = useRef<AbortController | null>(null);
  // Server-rendered data is already fresh, so the first poll is deferred.
  const skipFirstFetchRef = useRef(initialMarkets.length > 0);

  const fetchMarkets = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({ limit: String(limit) });
    if (query.trim()) params.set("q", query.trim());
    if (tagId != null) params.set("tag_id", String(tagId));

    try {
      const res = await fetch(`/api/markets?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data: unknown = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response shape");

      setMarkets(data as MarketSummary[]);
      setError(null);
    } catch {
      if (controller.signal.aborted) return;
      setError("Couldn't refresh live market data.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [limit, query, tagId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (skipFirstFetchRef.current) skipFirstFetchRef.current = false;
      else void fetchMarkets();
      interval = setInterval(fetchMarkets, POLL_INTERVAL_MS);
    };

    const stop = () => {
      clearInterval(interval);
      interval = undefined;
      abortRef.current?.abort();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else if (!interval) start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stop();
    };
  }, [fetchMarkets]);

  return { markets, loading, error, refresh: fetchMarkets };
}
