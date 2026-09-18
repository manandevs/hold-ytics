import React from "react";
import { BookLevel, OrderBook } from "@/types/market";
import { cn } from "@/lib/cn";

interface OrderBookPanelProps {
  book: OrderBook;
  /** Name of the outcome this book belongs to. */
  outcomeName: string;
}

const ROWS = 8;

function BookSide({
  levels,
  side,
  maxSize,
}: {
  levels: BookLevel[];
  side: "bid" | "ask";
  maxSize: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-1.5">
        <span>{side === "bid" ? "Bids" : "Asks"}</span>
        <span>Size</span>
      </div>

      <ol className="space-y-0.5">
        {levels.slice(0, ROWS).map((level, i) => (
          <li
            key={`${level.price}-${i}`}
            className="relative flex justify-between items-center text-xs font-semibold tabular-nums py-1 px-1.5 rounded overflow-hidden"
          >
            {/* Depth bar, sized against the deepest level on this side. */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 right-0 rounded",
                side === "bid" ? "bg-emerald-50" : "bg-rose-50"
              )}
              style={{ width: `${maxSize > 0 ? (level.size / maxSize) * 100 : 0}%` }}
            />
            <span
              className={cn(
                "relative",
                side === "bid" ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {Math.round(level.price * 100)}¢
            </span>
            <span className="relative text-zinc-600">
              {level.size.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </li>
        ))}

        {levels.length === 0 && (
          <li className="text-xs text-zinc-400 py-1 px-1.5">No resting orders</li>
        )}
      </ol>
    </div>
  );
}

export default function OrderBookPanel({ book, outcomeName }: OrderBookPanelProps) {
  const maxSize = Math.max(
    1,
    ...book.bids.slice(0, ROWS).map((l) => l.size),
    ...book.asks.slice(0, ROWS).map((l) => l.size)
  );

  return (
    <details className="bg-white border border-zinc-200 rounded-2xl shadow-sm group" open>
      <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
        <h2 className="text-base font-bold text-zinc-900">Order book</h2>
        <span className="text-xs font-semibold text-zinc-500">
          {outcomeName} · {book.bids.length + book.asks.length} levels
        </span>
      </summary>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-5 pb-5">
        <BookSide levels={book.bids} side="bid" maxSize={maxSize} />
        <BookSide levels={book.asks} side="ask" maxSize={maxSize} />
      </div>
    </details>
  );
}
