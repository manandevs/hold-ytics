import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  Holder,
  Market,
  MarketComment,
  OrderBook,
  Outcome,
  OutcomeSeries,
  Trade,
} from "@/types/market";
import { cn } from "@/lib/cn";
import {
  formatChange,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  toNumber,
} from "@/lib/format";
import MarketChartPanel from "@/components/markets/detail/MarketChartPanel";
import OrderBookPanel from "@/components/markets/detail/OrderBookPanel";
import MarketActivityTabs from "@/components/markets/detail/MarketActivityTabs";
import MarketFaq from "@/components/markets/detail/MarketFaq";
import TradePanel from "@/components/markets/detail/TradePanel";
import RelatedMarkets from "@/components/markets/detail/RelatedMarkets";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { MarketSummary } from "@/types/market";

export interface MarketDetailProps {
  market: Market;
  outcomes: Outcome[];
  series: OutcomeSeries[];
  tokenIds: string[];
  book: OrderBook;
  comments: MarketComment[];
  holders: Holder[];
  trades: Trade[];
  related: MarketSummary[];
  tradeUrl: string;
}

/** One figure in the summary strip under the title. */
function Metric({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={cn("text-lg font-extrabold text-zinc-900 tabular-nums", className)}>
        {children}
      </p>
    </div>
  );
}

function changeColor(value?: number) {
  const num = toNumber(value);
  if (num === null || num === 0) return "text-zinc-500";
  return num > 0 ? "text-emerald-600" : "text-rose-600";
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-semibold text-zinc-900 wrap-break-word">{children}</p>
    </div>
  );
}

export default function MarketDetail({
  market,
  outcomes,
  series,
  tokenIds,
  book,
  comments,
  holders,
  trades,
  related,
  tradeUrl,
}: MarketDetailProps) {
  const leading = outcomes.reduce<Outcome | null>(
    (best, o) => (best === null || o.price > best.price ? o : best),
    null
  );

  const change24h = toNumber(market.oneDayPriceChange);
  const trendIcon =
    change24h === null || change24h === 0 ? (
      <Minus size={16} aria-hidden />
    ) : change24h > 0 ? (
      <TrendingUp size={16} aria-hidden />
    ) : (
      <TrendingDown size={16} aria-hidden />
    );

  const event = market.events?.[0];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-5"
        >
          <ArrowLeft size={16} aria-hidden /> Back to markets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          {/* ---------- Main column ---------- */}
          <div className="space-y-6 min-w-0">
            {/* Title card */}
            <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-start gap-4">
                {market.image && (
                  <Image
                    src={market.image}
                    alt=""
                    width={112}
                    height={112}
                    className="size-14 rounded-xl object-cover ring-1 ring-zinc-200 shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 text-balance leading-tight">
                    {market.question}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    {market.closed ? "Closed" : market.active ? "Active" : "Inactive"} ·
                    Ends {formatDate(market.endDate)}
                  </p>
                </div>

                <CopyLinkButton />
              </div>

              {/* Summary strip */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100">
                <Metric label={leading ? `${leading.name} probability` : "Probability"}>
                  <span className="text-blue-600">{formatPercent(leading?.price ?? 0)}</span>
                </Metric>

                <Metric label="24h change" className={changeColor(market.oneDayPriceChange)}>
                  <span className="inline-flex items-center gap-1.5">
                    {trendIcon}
                    {formatChange(market.oneDayPriceChange)}
                  </span>
                </Metric>

                <Metric label="Total volume">
                  {formatCurrency(market.volumeNum ?? market.volume)}
                </Metric>

                <Metric label="Liquidity">
                  {formatCurrency(market.liquidityNum ?? market.liquidity)}
                </Metric>
              </div>
            </section>

            {/* Chart */}
            {series.length > 0 && (
              <MarketChartPanel initialSeries={series} tokenIds={tokenIds} />
            )}

            {/* Outcomes */}
            {outcomes.length > 0 && (
              <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
                <h2 className="text-base font-bold text-zinc-900 mb-4">Outcomes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {outcomes.map((outcome) => {
                    const isLeading = outcome.name === leading?.name;
                    const percent = Math.min(Math.max(outcome.price * 100, 0), 100);

                    return (
                      <div
                        key={outcome.name}
                        className={cn(
                          "p-3 border rounded-xl",
                          isLeading
                            ? "bg-blue-50 border-blue-500"
                            : "bg-zinc-50 border-zinc-200"
                        )}
                      >
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="font-semibold text-zinc-900 truncate">
                            {outcome.name}
                          </span>
                          <span className="font-bold text-zinc-900 tabular-nums shrink-0">
                            {formatPercent(outcome.price)}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Order book */}
            <OrderBookPanel book={book} outcomeName={outcomes[0]?.name ?? "Outcome"} />

            {/* Comments / holders / activity */}
            <MarketActivityTabs
              comments={comments}
              holders={holders}
              trades={trades}
              commentCount={event?.commentCount}
            />

            {/* Rules */}
            {market.description && (
              <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
                <h2 className="text-base font-bold text-zinc-900 mb-3">Rules</h2>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed">
                  {market.description}
                </p>
                <p className="mt-4 text-xs text-zinc-500">
                  Market opened {formatDateTime(market.createdAt)} · Last updated{" "}
                  {formatDateTime(market.updatedAt)}
                </p>
              </section>
            )}

            {/* Market data */}
            <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <h2 className="text-base font-bold text-zinc-900 mb-4">Market data</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="24h volume">{formatCurrency(market.volume24hr)}</Stat>
                <Stat label="1 week volume">{formatCurrency(market.volume1wk)}</Stat>
                <Stat label="1 month volume">{formatCurrency(market.volume1mo)}</Stat>
                <Stat label="1 year volume">{formatCurrency(market.volume1yr)}</Stat>
                <Stat label="Spread">{formatPercent(market.spread, 2)}</Stat>
                <Stat label="Min order">{formatNumber(market.orderMinSize, 2)}</Stat>
                <Stat label="Tick size">{formatNumber(market.orderPriceMinTickSize)}</Stat>
                <Stat label="Competitiveness">{formatPercent(market.competitive)}</Stat>
                <Stat label="1h change">{formatChange(market.oneHourPriceChange)}</Stat>
                <Stat label="1 week change">{formatChange(market.oneWeekPriceChange)}</Stat>
                <Stat label="1 month change">{formatChange(market.oneMonthPriceChange)}</Stat>
                <Stat label="Negative risk">{market.negRisk ? "Yes" : "No"}</Stat>
              </div>

              <dl className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500 space-y-1.5">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold text-zinc-700">Condition ID:</dt>
                  <dd className="font-mono break-all">{market.conditionId || "—"}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold text-zinc-700">Question ID:</dt>
                  <dd className="font-mono break-all">{market.questionID || "—"}</dd>
                </div>
              </dl>
            </section>

            <MarketFaq market={market} outcomes={outcomes} />
          </div>

          {/* ---------- Sidebar ---------- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <TradePanel
              market={market}
              outcomes={outcomes}
              book={book}
              tradeUrl={tradeUrl}
            />
            <RelatedMarkets markets={related} />
          </div>
        </div>
      </div>
    </div>
  );
}
