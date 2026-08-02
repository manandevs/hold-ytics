"use client";
import React, { useState } from "react";
import { Market } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";
import { useSearchParams } from "next/navigation";
import Card from "./card";

interface MarketsGridProps {
  initialMarkets: Market[];
}

export default function MarketsGrid({ initialMarkets }: MarketsGridProps) {
  // Pass initial data to hydrate immediately, then poll every 15s
  const { markets } = useMarkets(initialMarkets, 50); 
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  // Client-side filtering
  const filteredMarkets = markets.filter(market => 
    market.question.toLowerCase().includes(searchQuery) ||
    market.category?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
      {filteredMarkets.length > 0 ? (
        filteredMarkets.map((market) => (
          <Card key={market.id} market={market} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No markets found</h3>
          <p className="font-medium">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}