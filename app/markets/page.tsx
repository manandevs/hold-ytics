import React, { Suspense } from "react";
import { getMarkets } from "@/lib/api";
import MarketsGrid from "@/components/MarketsGrid";

export const revalidate = 30; 

export default async function MarketsPage() {
  const initialMarkets = await getMarkets(10);
  console.log(initialMarkets) 

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
            Explore Markets
          </h1>
          <p className="text-lg text-zinc-200 max-w-2xl font-medium">
            Browse all active markets, track live odds, and uncover the narratives driving global events.
          </p>
        </div>

        {/* Wrap in Suspense to safely use useSearchParams in child */}
        <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-200 rounded-2xl w-full" />}>
          <MarketsGrid initialMarkets={initialMarkets} />
        </Suspense>

      </div>
    </main>
  );
}
