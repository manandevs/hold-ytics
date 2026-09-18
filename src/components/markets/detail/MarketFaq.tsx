import React from "react";
import { ChevronDown } from "lucide-react";
import { Market, Outcome } from "@/types/market";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";

interface MarketFaqProps {
  market: Market;
  outcomes: Outcome[];
}

/**
 * Answers are generated from this market's own figures rather than written
 * copy, so nothing here can drift out of date with the data above.
 */
export default function MarketFaq({ market, outcomes }: MarketFaqProps) {
  const oddsSummary =
    outcomes.length > 0
      ? outcomes.map((o) => `${o.name} at ${formatPercent(o.price)}`).join(", ")
      : "No quoted outcomes right now.";

  const entries: { q: string; a: React.ReactNode }[] = [
    {
      q: `What is the "${market.question}" prediction market?`,
      a:
        market.description?.trim() ||
        `A prediction market on Polymarket that resolves according to the outcome of: ${market.question}`,
    },
    {
      q: "What are the current odds?",
      a: `${oddsSummary} Odds move with trading and refresh as the market updates.`,
    },
    {
      q: "How much trading activity has this market generated?",
      a: `${formatCurrency(market.volumeNum ?? market.volume)} in total volume, with ${formatCurrency(
        market.volume24hr
      )} in the last 24 hours and ${formatCurrency(
        market.liquidityNum ?? market.liquidity
      )} of liquidity currently available.`,
    },
    {
      q: "When does this market close?",
      a: `Trading runs until ${formatDate(market.endDate)}. The market opened on ${formatDate(
        market.startDate ?? market.createdAt
      )}.`,
    },
    {
      q: "How do I trade this market?",
      a: "Holdytic is a read-only view of Polymarket data. Use the “Trade on Polymarket” link to place an order on Polymarket itself, where you can connect a wallet and fund a position.",
    },
  ];

  return (
    <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-zinc-900 mb-2">
        Frequently asked questions
      </h2>

      <div className="divide-y divide-zinc-100">
        {entries.map((entry) => (
          <details key={entry.q} className="group py-1">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none py-3 text-sm font-semibold text-zinc-900">
              {entry.q}
              <ChevronDown
                size={16}
                aria-hidden
                className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="pb-3 text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {entry.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
