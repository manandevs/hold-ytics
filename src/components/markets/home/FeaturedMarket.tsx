import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { FeaturedMarket as FeaturedMarketData } from "@/lib/polymarket/markets";
import { formatCurrency, formatDate } from "@/lib/format";
import PriceChart from "@/components/markets/PriceChart";
export default function FeaturedMarket({ market, series }: FeaturedMarketData) {
  const hasChart = series.some((s) => s.points.length > 1);

  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 sm:p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Market identity + current odds */}
        <div className="lg:w-72 shrink-0">
          <div className="flex items-start gap-3">
            {market.image && (
              <Image
                src={market.image}
                alt=""
                width={96}
                height={96}
                className="size-12 rounded-lg object-cover ring-1 ring-zinc-200 shrink-0"
              />
            )}
            <h2 id="featured-heading" className="text-lg font-bold text-zinc-900 leading-snug">
              <Link
                href={`/markets/${market.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {market.question}
              </Link>
            </h2>
          </div>

          <dl className="mt-4 space-y-2">
            {series.map((outcome) => (
              <div
                key={outcome.name}
                className="flex items-baseline justify-between gap-3 border-b border-zinc-100 pb-2 last:border-0"
              >
                <dt className="text-sm font-semibold text-zinc-700 truncate">
                  {outcome.name}
                </dt>
                <dd className="text-lg font-extrabold text-zinc-900 tabular-nums shrink-0">
                  {(outcome.price * 100).toFixed(1)}%
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-xs font-semibold text-zinc-500">
            {formatCurrency(market.volumeNum ?? market.volume)} Vol. · Ends{" "}
            {formatDate(market.endDate)}
          </p>
        </div>

        {/* Price history */}
        <div className="flex-1 min-w-0">
          {hasChart ? (
            <PriceChart series={series} />
          ) : (
            <p className="text-sm text-zinc-500 py-12 text-center">
              No price history available for this market yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
