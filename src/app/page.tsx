import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedMarket, getMarkets } from "@/lib/polymarket/markets";
import FeaturedMarket from "@/components/markets/home/FeaturedMarket";
import HotTopics from "@/components/markets/home/HotTopics";
import MarketCard from "@/components/markets/MarketCard";
import MarketGridSkeleton from "@/components/markets/home/MarketGridSkeleton";
import { buttonStyles } from "@/components/ui/Button";

// Four rows of the four-column grid; the full list lives on /markets.
const PREVIEW_COUNT = 16;
const HOT_TOPIC_LIMIT = 5;

// Keep in sync with REVALIDATE_SECONDS in lib/polymarket/client.ts.
export const revalidate = 30;

/** The featured chart and the sidebar share one suspense boundary. */
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

async function TrendingSection() {
  const markets = await getMarkets({ limit: PREVIEW_COUNT });

  if (markets.length === 0) {
    return (
      <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Live markets are unavailable right now. Please refresh in a moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense
          fallback={
            <div className="h-72 rounded-2xl bg-white border border-zinc-200 animate-pulse mb-10" />
          }
        >
          <FeaturedSection />
        </Suspense>

        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Trending markets
          </h1>
          <Link
            href="/markets"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all markets
          </Link>
        </div>

        <Suspense fallback={<MarketGridSkeleton count={PREVIEW_COUNT} />}>
          <TrendingSection />
        </Suspense>

        <div className="mt-10 flex justify-center">
          <Link href="/markets" className={buttonStyles()}>
            Browse all markets
            <ArrowRight size={16} className="ml-2" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  );
}
