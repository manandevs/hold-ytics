"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Holder, MarketComment, Trade } from "@/types/market";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

interface MarketActivityTabsProps {
  comments: MarketComment[];
  holders: Holder[];
  trades: Trade[];
  commentCount?: number;
}

type TabId = "comments" | "holders" | "activity";

/** Compact relative time, e.g. `5h ago`. */
function timeAgo(iso: string | number): string {
  const ms = typeof iso === "number" ? iso * 1000 : new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  const units: [number, string][] = [
    [60, "s"],
    [3600, "m"],
    [86400, "h"],
    [2592000, "d"],
  ];

  if (seconds < 60) return `${seconds}s ago`;
  for (let i = 1; i < units.length; i++) {
    if (seconds < units[i][0]) {
      return `${Math.floor(seconds / units[i - 1][0])}${units[i][1]} ago`;
    }
  }
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

/** Shared round avatar with a neutral fallback. */
function Avatar({ src, name }: { src?: string; name: string }) {
  if (!src) {
    return (
      <span
        className="size-8 shrink-0 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600"
        aria-hidden
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      className="size-8 shrink-0 rounded-full object-cover bg-zinc-100"
    />
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-zinc-500">{children}</p>;
}

export default function MarketActivityTabs({
  comments,
  holders,
  trades,
  commentCount,
}: MarketActivityTabsProps) {
  const [tab, setTab] = useState<TabId>("comments");

  const tabs: { id: TabId; label: string }[] = [
    {
      id: "comments",
      label: `Comments${commentCount ? ` (${commentCount.toLocaleString("en-US")})` : ""}`,
    },
    { id: "holders", label: "Top holders" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div role="tablist" aria-label="Market activity" className="flex gap-1 border-b border-zinc-200 px-3 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={cn(
              "px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer",
              tab === item.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "comments" && (
          <div role="tabpanel" id="panel-comments" aria-labelledby="tab-comments">
            {comments.length === 0 ? (
              <EmptyState>No comments on this market yet.</EmptyState>
            ) : (
              <ul className="space-y-5">
                {comments.map((comment) => (
                  <li key={comment.id} className="flex gap-3">
                    <Avatar src={comment.authorImage} name={comment.authorName} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-bold text-zinc-900 truncate">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-zinc-700 wrap-break-word whitespace-pre-wrap">
                        {comment.body}
                      </p>
                      <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Heart size={12} aria-hidden />
                        {comment.reactionCount ?? 0}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "holders" && (
          <div role="tabpanel" id="panel-holders" aria-labelledby="tab-holders">
            {holders.length === 0 ? (
              <EmptyState>No holder data available for this market.</EmptyState>
            ) : (
              <ol className="divide-y divide-zinc-100">
                {holders.map((holder) => (
                  <li key={holder.address} className="flex items-center gap-3 py-2.5">
                    <Avatar src={holder.image} name={holder.name} />
                    <span className="flex-1 min-w-0 text-sm font-semibold text-zinc-900 truncate">
                      {holder.name}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500 shrink-0">
                      {holder.outcome}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 tabular-nums shrink-0 w-24 text-right">
                      {formatNumber(holder.amount, 0)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === "activity" && (
          <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity">
            {trades.length === 0 ? (
              <EmptyState>No recent trades on this market.</EmptyState>
            ) : (
              <ol className="divide-y divide-zinc-100">
                {trades.map((trade) => (
                  <li key={trade.id} className="flex items-center gap-3 py-2.5">
                    <Avatar src={trade.image} name={trade.name} />
                    <span className="flex-1 min-w-0 text-sm text-zinc-700 truncate">
                      <span className="font-semibold text-zinc-900">{trade.name}</span>{" "}
                      <span
                        className={cn(
                          "font-bold",
                          trade.side === "BUY" ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {trade.side === "BUY" ? "bought" : "sold"}
                      </span>{" "}
                      {formatNumber(trade.size, 0)} {trade.outcome}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 tabular-nums shrink-0">
                      {Math.round(trade.price * 100)}¢
                    </span>
                    <span className="text-xs text-zinc-500 shrink-0 w-16 text-right">
                      {timeAgo(trade.timestamp)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
