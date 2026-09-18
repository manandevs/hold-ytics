import React from "react";
import { VolumeBucket } from "@/types/accuracy";
import { formatCurrency } from "@/lib/format";

const BAR_COLOR = "#2a78d6";

/** Brier score per volume quartile. Lower bars are better predictions. */
export default function BrierByVolume({ buckets }: { buckets: VolumeBucket[] }) {
  if (buckets.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">
        Not enough resolved markets to split by volume.
      </p>
    );
  }

  const max = Math.max(...buckets.map((b) => b.brier), 0.0001);

  return (
    <div>
      <ol className="space-y-3">
        {buckets.map((bucket) => (
          <li key={bucket.label}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="text-sm font-semibold text-zinc-900">
                {bucket.label}
                <span className="ml-2 font-normal text-xs text-zinc-500">
                  {formatCurrency(bucket.minVolume)} – {formatCurrency(bucket.maxVolume)} ·{" "}
                  {bucket.sampleSize} markets
                </span>
              </span>
              <span className="text-sm font-extrabold text-zinc-900 tabular-nums shrink-0">
                {bucket.brier.toFixed(4)}
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((bucket.brier / max) * 100, 1)}%`,
                  background: BAR_COLOR,
                }}
              />
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs text-zinc-500">
        Bars are scaled against the worst quartile in this sample, so relative length shows
        which markets predicted best — not an absolute scale.
      </p>
    </div>
  );
}
