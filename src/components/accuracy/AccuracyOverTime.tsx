import React from "react";
import { HorizonStat } from "@/types/accuracy";

const LINE_COLOR = "#2a78d6";

const VIEW_W = 720;
const VIEW_H = 220;
const PAD = { top: 16, right: 16, bottom: 34, left: 44 };

/**
 * Accuracy at each lookback before resolution, furthest-out on the left so the
 * line reads left-to-right as the market approaches settlement.
 */
export default function AccuracyOverTime({ horizons }: { horizons: HorizonStat[] }) {
  const series = [...horizons].reverse();
  if (series.length < 2) return null;

  const innerW = VIEW_W - PAD.left - PAD.right;
  const innerH = VIEW_H - PAD.top - PAD.bottom;

  const values = series.map((h) => h.accuracy);
  const min = Math.min(...values, 0.5);
  const lower = Math.floor(min * 10) / 10;
  const span = 1 - lower || 1;

  const x = (i: number) => PAD.left + (i / (series.length - 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - (v - lower) / span) * innerH;

  const path = series
    .map((h, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(h.accuracy).toFixed(2)}`)
    .join(" ");

  const ticks = [lower, lower + span / 2, 1];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Accuracy by lookback: ${series
          .map((h) => `${h.label} before, ${(h.accuracy * 100).toFixed(1)} percent`)
          .join("; ")}`}
      >
        {ticks.map((value) => (
          <g key={value}>
            <line
              x1={PAD.left}
              x2={VIEW_W - PAD.right}
              y1={y(value)}
              y2={y(value)}
              stroke="#e4e4e7"
              strokeWidth={1}
            />
            <text x={8} y={y(value) + 4} fontSize={11} fill="#71717a">
              {(value * 100).toFixed(0)}%
            </text>
          </g>
        ))}

        <path
          d={path}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {series.map((h, i) => (
          <g key={h.id}>
            <circle
              cx={x(i)}
              cy={y(h.accuracy)}
              r={4}
              fill={LINE_COLOR}
              stroke="#ffffff"
              strokeWidth={2}
            />
            <text
              x={x(i)}
              y={y(h.accuracy) - 10}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill={LINE_COLOR}
            >
              {(h.accuracy * 100).toFixed(1)}%
            </text>
            <text
              x={x(i)}
              y={VIEW_H - 12}
              textAnchor="middle"
              fontSize={11}
              fill="#71717a"
            >
              {h.label}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-2 text-xs text-zinc-500">
        Share of markets whose favourite matched the eventual outcome, measured at each
        point before resolution. A single series, so the axis label names it.
      </figcaption>
    </figure>
  );
}
