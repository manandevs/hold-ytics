import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketSummary, Outcome } from "@/types/market";
import { cn } from "@/lib/cn";

/** The leading outcome, which is what the compact row reports. */
function leadingOutcome(outcomes: Outcome[]): Outcome | null {
  return outcomes.reduce<Outcome | null>(
    (best, o) => (best === null || o.price > best.price ? o : best),
    null
  );
}

export default function RelatedMarkets({ markets }: { markets: MarketSummary[] }) {
  if (markets.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5"
    >
      <h2 id="related-heading" className="text-base font-bold text-zinc-900 mb-3">
        Related markets
      </h2>

      <ul className="divide-y divide-zinc-100">
        {markets.map((market) => {
          const leading = leadingOutcome(market.outcomes);

          return (
            <li key={market.id}>
              <Link
                href={`/markets/${market.id}`}
                className="group flex items-center gap-3 py-3 transition-colors hover:bg-zinc-50 rounded-lg"
              >
                {market.image ? (
                  <Image
                    src={market.image}
                    alt=""
                    width={64}
                    height={64}
                    className="size-8 rounded object-cover ring-1 ring-zinc-200 shrink-0"
                  />
                ) : (
                  <span className="size-8 rounded bg-zinc-100 shrink-0" aria-hidden />
                )}

                <span className="flex-1 min-w-0 text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {market.question}
                </span>

                {leading && (
                  <span className="text-right shrink-0">
                    <span
                      className={cn(
                        "block text-sm font-extrabold tabular-nums",
                        leading.price >= 0.5 ? "text-emerald-600" : "text-rose-600"
                      )}
                    >
                      {Math.round(leading.price * 100)}%
                    </span>
                    <span className="block text-[11px] text-zinc-500 truncate max-w-16">
                      {leading.name}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
