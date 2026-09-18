import { Suspense } from "react";
import { findCategory, getFeaturedMarket, getMarkets } from "@/lib/api";
import CategoryNav from "@/components/CategoryNav";
import FeaturedMarket from "@/components/FeaturedMarket";
import HotTopics from "@/components/HotTopics";
import MarketsGrid from "@/components/MarketsGrid";
import MarketsGridSkeleton from "@/components/MarketsGridSkeleton";

const MARKET_LIMIT = 40;
const HOT_TOPIC_LIMIT = 5;

/** Suspended so the category bar paints before the market data resolves. */
async function MarketsSection({ query, tagId }: { query: string; tagId: number | null }) {
  const initialMarkets = await getMarkets({ limit: MARKET_LIMIT, query, tagId });

  return (
    <MarketsGrid
      initialMarkets={initialMarkets}
      query={query}
      tagId={tagId}
      limit={MARKET_LIMIT}
    />
  );
}

/** The featured chart and sidebar are independent of the active category. */
async function FeaturedSection() {
  const [featured, hotTopics] = await Promise.all([
    getFeaturedMarket(),
    getMarkets({ limit: HOT_TOPIC_LIMIT }),
  ]);

  if (!featured && hotTopics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mb-10">
      {featured ? <FeaturedMarket {...featured} /> : <div />}
      <HotTopics markets={hotTopics} />
    </div>
  );
}

export default async function Home({
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
        {/* Searching narrows the whole page, so the featured block steps aside. */}
        {!query && (
          <Suspense fallback={<div className="h-72 rounded-2xl bg-white border border-zinc-200 animate-pulse mb-10" />}>
            <FeaturedSection />
          </Suspense>
        )}

        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {query ? `Results for “${query}”` : "All markets"}
          </h1>
          {query && (
            <p className="text-sm font-medium text-zinc-500">
              Ranked by trading volume
            </p>
          )}
        </div>

        <div className="mb-6">
          <CategoryNav active={activeCategory.slug} query={query} />
        </div>

        {/* Keyed so a new query or category shows the skeleton again. */}
        <Suspense key={`${query}|${activeCategory.slug}`} fallback={<MarketsGridSkeleton />}>
          <MarketsSection query={query} tagId={activeCategory.tagId} />
        </Suspense>
      </div>
    </main>
  );
}
