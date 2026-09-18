import type { Metadata } from "next";
import { Suspense } from "react";
import { findCategory, getMarkets } from "@/lib/polymarket/markets";
import CategoryNav from "@/components/markets/home/CategoryNav";
import MarketGrid from "@/components/markets/home/MarketGrid";
import MarketGridSkeleton from "@/components/markets/home/MarketGridSkeleton";

const PAGE_SIZE = 40;

export const metadata: Metadata = {
  title: "All markets",
  description:
    "Browse every active prediction market by category, ranked by trading volume, with live odds.",
};

/** Suspended separately so the heading and category bar paint immediately. */
async function MarketsSection({ query, tagId }: { query: string; tagId: number | null }) {
  const initialMarkets = await getMarkets({ limit: PAGE_SIZE, query, tagId });

  return (
    <MarketGrid
      initialMarkets={initialMarkets}
      query={query}
      tagId={tagId}
      limit={PAGE_SIZE}
      paginated
    />
  );
}

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q?.trim() ?? "";
  const activeCategory = findCategory(category);

  return (
    <main className="flex-1 bg-zinc-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            {query ? `Results for “${query}”` : "All markets"}
          </h1>
          <p className="text-sm font-medium text-zinc-500">Ranked by trading volume</p>
        </div>

        <div className="mb-6">
          <CategoryNav active={activeCategory.slug} query={query} basePath="/markets" />
        </div>

        {/* Keyed so a new query or category shows the skeleton again. */}
        <Suspense key={`${query}|${activeCategory.slug}`} fallback={<MarketGridSkeleton />}>
          <MarketsSection query={query} tagId={activeCategory.tagId} />
        </Suspense>
      </div>
    </main>
  );
}
