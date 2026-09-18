"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { OutcomeSeries, PricePoint } from "@/types/market";
import { DEFAULT_INTERVAL, INTERVALS, Interval } from "@/lib/polymarket/prices";
import { cn } from "@/lib/cn";
import PriceChart from "@/components/markets/PriceChart";
interface MarketChartPanelProps {
  /** Server-rendered series for the default interval. */
  initialSeries: OutcomeSeries[];
  /** CLOB token ids, aligned with `initialSeries`. */
  tokenIds: string[];
}

export default function MarketChartPanel({
  initialSeries,
  tokenIds,
}: MarketChartPanelProps) {
  const [interval, setInterval] = useState<Interval>(DEFAULT_INTERVAL);
  const [series, setSeries] = useState(initialSeries);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (next: Interval) => {
      if (next === DEFAULT_INTERVAL) {
        // The server already rendered this range.
        abortRef.current?.abort();
        setSeries(initialSeries);
        setError(null);
        setLoading(false);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      const params = new URLSearchParams({ interval: next });
      for (const token of tokenIds) params.append("token", token);

      try {
        const res = await fetch(`/api/price-history?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data: { series?: PricePoint[][] } = await res.json();
        if (!Array.isArray(data.series)) throw new Error("Unexpected response");

        setSeries(
          initialSeries.map((outcome, i) => ({
            ...outcome,
            points: data.series?.[i] ?? [],
          }))
        );
        setError(null);
      } catch {
        if (controller.signal.aborted) return;
        setError("Couldn't load that time range.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [initialSeries, tokenIds]
  );

  // Keep the chart in step with server-refreshed data on the default range.
  useEffect(() => {
    if (interval === DEFAULT_INTERVAL) setSeries(initialSeries);
  }, [initialSeries, interval]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSelect = (next: Interval) => {
    setInterval(next);
    void load(next);
  };

  const hasPoints = series.some((s) => s.points.length > 1);

  return (
    <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-base font-bold text-zinc-900">Price history</h2>

        <div
          role="group"
          aria-label="Chart time range"
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 p-1"
        >
          {INTERVALS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              aria-pressed={interval === option.value}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer",
                interval === option.value
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("transition-opacity", loading && "opacity-50")}>
        {hasPoints ? (
          <PriceChart series={series} />
        ) : (
          <p className="py-16 text-center text-sm text-zinc-500">
            {loading ? "Loading…" : "No price history for this range."}
          </p>
        )}
      </div>

      {error && (
        <p role="status" className="mt-2 text-sm font-medium text-amber-700">
          {error}
        </p>
      )}
    </section>
  );
}
