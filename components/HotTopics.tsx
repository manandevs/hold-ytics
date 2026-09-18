import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Flame } from "lucide-react";
import { MarketSummary } from "@/types/market";
import { formatCurrency } from "@/lib/format";

interface HotTopicsProps {
  /** Markets already ordered by 24h volume. */
  markets: MarketSummary[];
}

export default function HotTopics({ markets }: HotTopicsProps) {
  if (markets.length === 0) return null;

  return (
    <section
      aria-labelledby="hot-topics-heading"
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5"
    >
      <h2
        id="hot-topics-heading"
        className="flex items-center gap-2 text-base font-bold text-zinc-900 mb-3"
      >
        <Flame size={16} className="text-orange-500" aria-hidden />
        Hot topics
      </h2>

      <ol className="divide-y divide-zinc-100">
        {markets.map((market, index) => (
          <li key={market.id}>
            <Link
              href={`/markets/${market.id}`}
              className="group flex items-center gap-3 py-2.5 rounded-lg transition-colors hover:bg-zinc-50"
            >
              <span className="w-4 text-xs font-bold text-zinc-400 tabular-nums shrink-0">
                {index + 1}
              </span>

              {market.image ? (
                <Image
                  src={market.image}
                  alt=""
                  width={56}
                  height={56}
                  className="size-7 rounded object-cover ring-1 ring-zinc-200 shrink-0"
                />
              ) : (
                <span className="size-7 rounded bg-zinc-100 shrink-0" aria-hidden />
              )}

              <span className="flex-1 min-w-0 text-sm font-semibold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                {market.question}
              </span>

              <span className="text-xs font-semibold text-zinc-500 tabular-nums shrink-0">
                {formatCurrency(market.volume)}
              </span>

              <ChevronRight
                size={14}
                className="text-zinc-300 shrink-0 group-hover:text-zinc-500 transition-colors"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
