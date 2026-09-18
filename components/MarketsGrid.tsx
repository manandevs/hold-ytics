"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { MarketSummary } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";
import MarketCard from "./MarketCard";
import MarketsGridSkeleton from "./MarketsGridSkeleton";

interface MarketsGridProps {
  initialMarkets: MarketSummary[];
  /** The active search term, kept in sync with the server-rendered results. */
  query?: string;
  /** The active category tag, kept in sync with the server-rendered results. */
  tagId?: number | null;
  limit?: number;
}

export default function MarketsGrid({
  initialMarkets,
  query = "",
  tagId = null,
  limit = 50,
}: MarketsGridProps) {
  const { markets, loading, error } = useMarkets({ initialMarkets, limit, query, tagId });

  if (loading && markets.length === 0) return <MarketsGridSkeleton />;

  if (markets.length === 0) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </>
  );
}
