import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Market, Outcome, OrderBook } from "@/types/market";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";

interface TradePanelProps {
  market: Market;
  outcomes: Outcome[];
  /** Book for the first outcome token, used for live best bid/ask. */
  book: OrderBook;
  tradeUrl: string;
}

/** Renders a price as whole cents, the unit Polymarket quotes in. */
function cents(price: number) {
  return `${Math.round(price * 100)}¢`;
}

function outcomeTone(name: string, index: number) {
  const label = name.trim().toLowerCase();
  if (label === "yes" || label === "up") return "bg-emerald-600 text-white";
  if (label === "no" || label === "down") return "bg-rose-600 text-white";
  return index === 0 ? "bg-blue-600 text-white" : "bg-zinc-700 text-white";
}

export default function TradePanel({
  market,
  outcomes,
  book,
  tradeUrl,
}: TradePanelProps) {
  const bestBid = book.bids[0]?.price;
  const bestAsk = book.asks[0]?.price;
  const spread = bestBid !== undefined && bestAsk !== undefined ? bestAsk - bestBid : null;

  return (
    <aside className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
      {/* Market identity */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        {market.image && (
          <Image
            src={market.image}
            alt=""
            width={80}
            height={80}
            className="size-10 rounded-lg object-cover ring-1 ring-zinc-200 shrink-0"
          />
        )}
        <p className="text-sm font-bold text-zinc-900 line-clamp-2">{market.question}</p>
      </div>

      {/* Live prices per outcome */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {outcomes.map((outcome, i) => (
          <div
            key={outcome.name}
            className={cn(
              "rounded-lg px-3 py-3 text-center",
              outcomeTone(outcome.name, i)
            )}
          >
            <span className="block text-xs font-bold uppercase tracking-wide truncate">
              {outcome.name}
            </span>
            <span className="block text-xl font-extrabold tabular-nums">
              {cents(outcome.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Book summary — the real numbers behind those prices */}
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Best bid</dt>
          <dd className="font-semibold text-zinc-900 tabular-nums">
            {bestBid !== undefined ? cents(bestBid) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Best ask</dt>
          <dd className="font-semibold text-zinc-900 tabular-nums">
            {bestAsk !== undefined ? cents(bestAsk) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Spread</dt>
          <dd className="font-semibold text-zinc-900 tabular-nums">
            {spread !== null ? formatPercent(spread, 2) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Orders</dt>
          <dd className="font-semibold text-zinc-900">
            {market.acceptingOrders ? "Open" : "Closed"}
          </dd>
        </div>
      </dl>

      <a
        href={tradeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Trade on Polymarket
        <ArrowUpRight size={16} aria-hidden />
      </a>

      <p className="mt-3 text-xs text-zinc-500 text-center">
        Holdytic is read-only. Orders are placed on Polymarket.
      </p>
    </aside>
  );
}
