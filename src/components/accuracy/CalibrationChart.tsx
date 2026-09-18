"use client";

import React, { useState } from "react";
import { CalibrationBucket } from "@/types/accuracy";
import { HorizonStat } from "@/types/accuracy";
import { cn } from "@/lib/cn";

/**
 * Categorical slots 1 and 2 of the reference palette — validated against a
 * white surface (adjacent CVD ΔE 24.7, normal-vision ΔE 33.6, both ≥ 3:1).
 */
const EXPECTED_COLOR = "#2a78d6";
const ACTUAL_COLOR = "#eb6834";

interface CalibrationChartProps {
  /** Calibration bands keyed by horizon id. */
  calibration: Record<string, CalibrationBucket[]>;
  horizons: HorizonStat[];
  defaultHorizon: string;
}

export default function CalibrationChart({
  calibration,
  horizons,
  defaultHorizon,
}: CalibrationChartProps) {
  const [horizon, setHorizon] = useState(defaultHorizon);
  const buckets = calibration[horizon] ?? [];
  const populated = buckets.filter((b) => b.sampleSize > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="font-semibold text-zinc-700">Measured</span>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            aria-label="Lookback before resolution"
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-zinc-900 cursor-pointer focus:border-zinc-400 focus:outline-none"
          >
            {horizons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label} before
              </option>
            ))}
          </select>
        </label>

        {/* Legend — identity never rests on colour alone. */}
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: EXPECTED_COLOR }}
              aria-hidden
            />
            Expected
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: ACTUAL_COLOR }}
              aria-hidden
            />
            Resolved
          </span>
        </div>
      </div>

      {populated.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500">
          Not enough resolved markets at this lookback.
        </p>
      ) : (
        <>
          <div className="flex items-end gap-1 sm:gap-2 h-64 border-b border-l border-zinc-200 pl-2 pb-0">
            {buckets.map((bucket) => {
              const empty = bucket.sampleSize === 0;
              return (
                <div
                  key={bucket.lower}
                  className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1"
                  title={
                    empty
                      ? `${bucket.lower}–${bucket.upper}%: no markets`
                      : `${bucket.lower}–${bucket.upper}%: ${bucket.sampleSize} markets, ` +
                        `expected ${(bucket.expected * 100).toFixed(1)}%, ` +
                        `resolved ${(bucket.actual * 100).toFixed(1)}%`
                  }
                >
                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    <div
                      className="w-1/2 max-w-5 rounded-t-sm"
                      style={{
                        height: `${bucket.expected * 100}%`,
                        background: EXPECTED_COLOR,
                        minHeight: empty ? 0 : 2,
                      }}
                    />
                    <div
                      className="w-1/2 max-w-5 rounded-t-sm"
                      style={{
                        height: `${bucket.actual * 100}%`,
                        background: ACTUAL_COLOR,
                        minHeight: empty ? 0 : 2,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-1 sm:gap-2 pl-2 mt-1.5">
            {buckets.map((bucket) => (
              <span
                key={bucket.lower}
                className={cn(
                  "flex-1 min-w-0 text-center text-[10px] sm:text-xs tabular-nums",
                  bucket.sampleSize === 0 ? "text-zinc-300" : "text-zinc-500"
                )}
              >
                {bucket.lower}%
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            Each band groups markets by the price they quoted. Bars of equal height mean the
            market was well calibrated — a market priced at 70% should resolve Yes about 70%
            of the time. Empty bands had no markets in the sample.
          </p>

          {/* Table view keeps the figures available without reading the bars. */}
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-zinc-600 hover:text-zinc-900">
              View as table
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="py-2 pr-4 font-bold">Band</th>
                    <th className="py-2 pr-4 font-bold">Markets</th>
                    <th className="py-2 pr-4 font-bold">Expected</th>
                    <th className="py-2 font-bold">Resolved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {populated.map((bucket) => (
                    <tr key={bucket.lower}>
                      <td className="py-2 pr-4 font-semibold text-zinc-900 tabular-nums">
                        {bucket.lower}–{bucket.upper}%
                      </td>
                      <td className="py-2 pr-4 text-zinc-600 tabular-nums">
                        {bucket.sampleSize}
                      </td>
                      <td className="py-2 pr-4 text-zinc-600 tabular-nums">
                        {(bucket.expected * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 text-zinc-600 tabular-nums">
                        {(bucket.actual * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
