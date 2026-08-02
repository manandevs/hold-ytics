"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Market } from "@/types/market";
import { cn } from "@/lib/cn";

// ---------- Helpers ----------
const toNumber = (val: unknown, fallback = 0): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

// ---------- Section ----------
const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-zinc-100 mb-4">{title}</h2>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      {children}
    </div>
  </section>
);

// ---------- Stat ----------
function Stat({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="font-semibold">{children}</p>
    </div>
  );
}

// ---------- Main ----------
export default function MarketDetailClient({ market }: { market: Market }) {
  let outcomes: string[] = [];
  let prices: number[] = [];

  try {
    outcomes = JSON.parse(market?.outcomes || "[]");
    prices = JSON.parse(market?.outcomePrices || "[]").map((p: string) =>
      toNumber(p)
    );
  } catch {}

  const primaryPrice = (prices[0] ?? 0) * 100;

  const change24h = toNumber(market?.oneDayPriceChange) * 100;
  const change1w = toNumber(market?.oneWeekPriceChange) * 100;
  const change1m = toNumber(market?.oneMonthPriceChange) * 100;

  const trend =
    change24h > 0 ? "up" : change24h < 0 ? "down" : "flat";

  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
      ? "text-red-500"
      : "text-zinc-400";

  const trendIcon =
    trend === "up" ? (
      <TrendingUp size={18} />
    ) : trend === "down" ? (
      <TrendingDown size={18} />
    ) : (
      <Minus size={18} />
    );

  const maxProb = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* Back */}
        <Link
          href="/markets"
          className="flex items-center gap-2 text-zinc-400 mb-8"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Header */}
        <div className="mb-10 flex gap-6 items-start">
          {market?.image && (
            <img
              src={market?.image}
              alt="market"
              className="w-24 h-24 rounded-xl object-cover border border-zinc-800"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{market?.question}</h1>

            <div className="flex gap-3 mt-3 text-sm text-zinc-400">
              <span>{market?.category || "General"}</span>
              <span>•</span>
              <span>
                Ends{" "}
                {market?.endDate
                  ? new Date(market.endDate).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Price Panel */}
        <Section title="Market Price">
          <div className="flex flex-wrap gap-10 items-center">

            <div>
              <p className="text-sm text-zinc-400">Probability</p>
              <p className="text-5xl font-black text-blue-500">
                {primaryPrice.toFixed(1)}%
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">24h Change</p>
              <div className={cn("flex items-center gap-2", trendColor)}>
                {trendIcon}
                {change24h.toFixed(2)}%
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Last Trade</p>
              <p>{market?.lastTradePrice?.toFixed(3) ?? "-"}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Bid / Ask</p>
              <p>
                {market?.bestBid?.toFixed(3) ?? "-"} /{" "}
                {market?.bestAsk?.toFixed(3) ?? "-"}
              </p>
            </div>

          </div>
        </Section>

        {/* Price Performance */}
        <Section title="Price Performance">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label="24h">{change24h.toFixed(2)}%</Stat>
            <Stat label="1 Week">{change1w.toFixed(2)}%</Stat>
            <Stat label="1 Month">{change1m.toFixed(2)}%</Stat>
          </div>
        </Section>

        {/* Outcomes */}
        <Section title="Outcomes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomes.map((o, i) => {
              const prob = (prices[i] ?? 0) * 100;

              return (
                <div
                  key={o}
                  className={cn(
                    "p-4 border rounded-xl",
                    prob === maxProb
                      ? "bg-blue-900/30 border-blue-500"
                      : "bg-zinc-800 border-zinc-700"
                  )}
                >
                  <div className="flex justify-between">
                    <span>{o}</span>
                    <span className="font-bold">
                      {prob.toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 bg-zinc-700 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Market Stats */}
        <Section title="Market Stats">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Stat label="Total Volume">
              ${market?.volumeNum?.toLocaleString()}
            </Stat>

            <Stat label="24h Volume">
              ${market?.volume24hr?.toLocaleString()}
            </Stat>

            <Stat label="1 Week Volume">
              ${market?.volume1wk?.toLocaleString()}
            </Stat>

            <Stat label="1 Month Volume">
              ${market?.volume1mo?.toLocaleString()}
            </Stat>

            <Stat label="Liquidity">
              ${market?.liquidityNum?.toLocaleString()}
            </Stat>

            <Stat label="All-Time Volume">
              ${market?.volume1yr?.toLocaleString()}
            </Stat>
          </div>
        </Section>

        {/* Trading Info */}
        <Section title="Trading Info">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Spread">
              {(toNumber(market?.spread) * 100).toFixed(2)}%
            </Stat>

            <Stat label="Min Order">
              {market?.orderMinSize ?? "-"}
            </Stat>

            <Stat label="Tick Size">
              {market?.orderPriceMinTickSize ?? "-"}
            </Stat>

            <Stat label="Orders">
              {market?.acceptingOrders ? "Open" : "Closed"}
            </Stat>
          </div>
        </Section>

        {/* Market Status */}
        <Section title="Market Status">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Status">
              {market?.closed
                ? "Closed"
                : market?.active
                ? "Active"
                : "Inactive"}
            </Stat>

            <Stat label="Competitive">
              {(toNumber(market?.competitive) * 100).toFixed(1)}%
            </Stat>

            <Stat label="Negative Risk">
              {market?.negRisk ? "Yes" : "No"}
            </Stat>

            <Stat label="Order Book">
              {market?.enableOrderBook ? "Enabled" : "Disabled"}
            </Stat>
          </div>
        </Section>

        {/* Description */}
        {market?.description && (
          <Section title="Market Rules">
            <p className="text-zinc-400 whitespace-pre-wrap">
              {market?.description}
            </p>
          </Section>
        )}

        {/* Events */}
        {Array.isArray(market?.events) && (
          <Section title="Related Events">
            <div className="space-y-4">
              {market.events.map((e: { id: string; title: string; description?: string }) => (
                <div
                  key={e.id}
                  className="p-4 bg-zinc-800 rounded-xl"
                >
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-zinc-400">
                    {e.description ?? "-"}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Metadata */}
        <Section title="Metadata">
          <div className="text-sm text-zinc-400 space-y-1">
            <p>
              Created:{" "}
              {market?.createdAt
                ? new Date(market.createdAt).toLocaleString()
                : "-"}
            </p>
            <p>
              Updated:{" "}
              {market?.updatedAt
                ? new Date(market.updatedAt).toLocaleString()
                : "-"}
            </p>
            <p>Condition ID: {market?.conditionId}</p>
            <p>Question ID: {market?.questionID}</p>
          </div>
        </Section>

      </div>
    </div>
  );
}