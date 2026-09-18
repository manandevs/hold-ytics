import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketSummary, Outcome } from "@/types/market";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

interface MarketCardProps {
  market: MarketSummary;
}

/** Yes/No markets get the familiar green/red treatment; anything else is neutral. */
function outcomeTone(name: string) {
  const label = name.trim().toLowerCase();
  if (label === "yes") {
    return "bg-emerald-50 text-emerald-700 group-hover/btn:bg-emerald-100";
  }
  if (label === "no") {
    return "bg-rose-50 text-rose-700 group-hover/btn:bg-rose-100";
  }
  return "bg-zinc-100 text-zinc-700 group-hover/btn:bg-zinc-200";
}

/**
 * Circular gauge showing the leading outcome's probability, mirroring the
 * "% chance" dial on the reference design.
 */
function ChanceGauge({ percent }: { percent: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(Math.max(percent, 0), 100) / 100) * circumference;

  return (
    <div className="relative size-11 shrink-0" aria-hidden>
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#e4e4e7" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#2a78d6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-zinc-900 tabular-nums">
        {Math.round(percent)}
      </span>
    </div>
  );
}

function OutcomeButton({ outcome }: { outcome: Outcome }) {
  return (
    <span
      className={cn(
        "group/btn flex-1 min-w-0 rounded-lg py-2 px-2 text-center transition-colors",
        outcomeTone(outcome.name)
      )}
    >
      <span className="block text-xs font-bold uppercase tracking-wide truncate">
        {outcome.name}
      </span>
      <span className="block text-sm font-extrabold tabular-nums">
        {Math.round(outcome.price * 100)}%
      </span>
    </span>
  );
}

export default function MarketCard({ market }: MarketCardProps) {
  const { outcomes } = market;
  const leading = outcomes.reduce<Outcome | null>(
    (best, o) => (best === null || o.price > best.price ? o : best),
    null
  );

  return (
    <Link
      href={`/markets/${market.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57c]"
    >
      <article className="h-full flex flex-col gap-4 rounded-2xl bg-white border border-zinc-200 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
        {/* Thumbnail + question + chance */}
        <div className="flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-lg bg-zinc-100 overflow-hidden ring-1 ring-zinc-200">
            {market.image && (
              <Image
                src={market.image}
                alt=""
                width={80}
                height={80}
                className="size-full object-cover"
              />
            )}
          </div>

          <h3 className="flex-1 min-w-0 text-sm font-bold text-zinc-900 line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors">
            {market.question}
          </h3>

          {leading && <ChanceGauge percent={leading.price * 100} />}
        </div>

        {/* Outcomes */}
        {outcomes.length > 0 && (
          <div className="mt-auto flex gap-2">
            {outcomes.map((outcome) => (
              <OutcomeButton key={outcome.name} outcome={outcome} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className={cn(
            "text-xs font-semibold text-zinc-500 border-t border-zinc-100 pt-3",
            outcomes.length === 0 && "mt-auto"
          )}
        >
          {formatCurrency(market.volume)} Vol.
        </div>
      </article>
    </Link>
  );
}
