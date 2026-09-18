"use client";

import React, { useCallback, useState } from "react";
import { SearchX } from "lucide-react";
import { MarketSummary } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";
import MarketCard from "@/components/markets/MarketCard";
import MarketGridSkeleton from "@/components/markets/home/MarketGridSkeleton";
import { buttonStyles } from "@/components/ui/Button";

interface MarketGridProps {
  initialMarkets: MarketSummary[];
  /** The active search term, kept in sync with the server-rendered results. */
  query?: string;
  /** The active category tag, kept in sync with the server-rendered results. */
  tagId?: number | null;
  limit?: number;
  /** Adds a "Load more" button that appends further pages. */
  paginated?: boolean;
}

export default function MarketGrid({
  initialMarkets,
  query = "",
  tagId = null,
  limit = 50,
  paginated = false,
}: MarketGridProps) {
  const { markets, loading, error } = useMarkets({ initialMarkets, limit, query, tagId });

  // Pages appended by "Load more", held separately so polling can keep
  // refreshing the first page without discarding them.
  const [extra, setExtra] = useState<MarketSummary[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exhausted, setExhausted] = useState(false);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(markets.length + extra.length),
    });
    if (query.trim()) params.set("q", query.trim());
    if (tagId != null) params.set("tag_id", String(tagId));

    try {
      const res = await fetch(`/api/markets?${params}`);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data: unknown = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response");

      const seen = new Set([...markets, ...extra].map((m) => m.id));
      const fresh = (data as MarketSummary[]).filter((m) => !seen.has(m.id));

      if (fresh.length === 0) setExhausted(true);
      else setExtra((prev) => [...prev, ...fresh]);
    } catch {
      setExhausted(true);
    } finally {
      setLoadingMore(false);
    }
  }, [extra, limit, markets, query, tagId]);

  if (loading && markets.length === 0) return <MarketGridSkeleton />;

  const visible = [...markets, ...extra];

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-3xl border border-zinc-200">
        <SearchX size={40} className="text-zinc-400 mb-4" aria-hidden />
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No markets found</h2>
        <p className="font-medium text-zinc-600">
          {query
            ? `Nothing matched “${query}”. Try a different search.`
            : "No open markets in this category right now."}
        </p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
        >
          {error} Showing the most recent data.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
        {visible.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {paginated && (
        <div className="mt-10 flex flex-col items-center gap-3">
          {exhausted ? (
            <p className="text-sm text-zinc-500">
              That&apos;s every market we can load for this view.
            </p>
          ) : (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className={buttonStyles()}
            >
              {loadingMore ? "Loading…" : "Load more markets"}
            </button>
          )}
          <p className="text-xs text-zinc-500 tabular-nums">
            Showing {visible.length} markets
          </p>
        </div>
      )}
    </>
  );
}
