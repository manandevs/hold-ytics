import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComments, getHolders, getOrderBook, getTrades } from "@/lib/polymarket/activity";
import { getMarketById, getRelatedMarkets, parseTokenIds, polymarketUrl } from "@/lib/polymarket/markets";
import { getPriceHistory } from "@/lib/polymarket/prices";
import { parseOutcomes } from "@/lib/format";
import { DEFAULT_INTERVAL } from "@/lib/polymarket/prices";
import MarketDetail from "@/components/markets/detail/MarketDetail";
// Data freshness is handled by the fetch-level revalidate in lib/api.ts.
type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) return { title: "Market not found" };

  return {
    title: market.question,
    description: market.description?.slice(0, 160),
    openGraph: {
      title: market.question,
      images: market.image ? [market.image] : undefined,
    },
  };
}

export default async function MarketDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) notFound();

  const outcomes = parseOutcomes(market.outcomes, market.outcomePrices);
  const tokenIds = parseTokenIds(market);
  const eventId = market.events?.[0]?.id ?? "";

  // Every panel's data is fetched in parallel; each helper degrades to an
  // empty result on failure so one flaky endpoint can't blank the page.
  const [histories, book, comments, holders, trades, related] = await Promise.all([
    Promise.all(
      outcomes.map((_, i) =>
        tokenIds[i] ? getPriceHistory(tokenIds[i], DEFAULT_INTERVAL) : Promise.resolve([])
      )
    ),
    tokenIds[0] ? getOrderBook(tokenIds[0]) : Promise.resolve({ bids: [], asks: [] }),
    getComments(eventId, 20),
    getHolders(
      market.conditionId ?? "",
      outcomes.map((o) => o.name),
      10
    ),
    getTrades(market.conditionId ?? "", 20),
    getRelatedMarkets(market, 5),
  ]);

  const series = outcomes.map((outcome, i) => ({
    name: outcome.name,
    price: outcome.price,
    points: histories[i] ?? [],
  }));

  return (
    <main className="flex-1">
      <MarketDetail
        market={market}
        outcomes={outcomes}
        series={series}
        tokenIds={tokenIds}
        book={book}
        comments={comments}
        holders={holders}
        trades={trades}
        related={related}
        tradeUrl={polymarketUrl(market)}
      />
    </main>
  );
}
