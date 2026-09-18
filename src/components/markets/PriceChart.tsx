"use client";

import React, { useMemo, useRef, useState } from "react";
import { OutcomeSeries } from "@/types/market";

/**
 * Categorical slots 1 and 2 of the reference palette. Validated against a white
 * surface: adjacent CVD ΔE 24.7, normal-vision ΔE 33.6, both above 3:1 contrast.
 */
const SERIES_COLORS = ["#2a78d6", "#eb6834"];

const VIEW_W = 760;
const VIEW_H = 240;
const PAD = { top: 12, right: 54, bottom: 24, left: 8 };

interface PriceChartProps {
  series: OutcomeSeries[];
}

interface Projected {
  name: string;
  color: string;
  path: string;
  /** Final point, used for the direct label at the line's end. */
  end: { x: number; y: number; p: number } | null;
}

export default function PriceChart({ series }: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotted = useMemo(() => series.filter((s) => s.points.length > 1), [series]);

  const { lines, domain, ticks, sampleCount } = useMemo(() => {
    const empty = {
      lines: [] as Projected[],
      domain: { min: 0, max: 1 },
      ticks: [] as { x: number; label: string }[],
      sampleCount: 0,
    };
    if (plotted.length === 0) return empty;

    const allTimes = plotted.flatMap((s) => s.points.map((pt) => pt.t));
    const minT = Math.min(...allTimes);
    const maxT = Math.max(...allTimes);
    const span = maxT - minT || 1;

    const innerW = VIEW_W - PAD.left - PAD.right;
    const innerH = VIEW_H - PAD.top - PAD.bottom;

    // Prices are probabilities, so the axis is always the full 0–100% range.
    const toX = (t: number) => PAD.left + ((t - minT) / span) * innerW;
    const toY = (p: number) => PAD.top + (1 - Math.min(Math.max(p, 0), 1)) * innerH;

    const lines: Projected[] = plotted.map((s, i) => {
      const path = s.points
        .map((pt, idx) => `${idx === 0 ? "M" : "L"}${toX(pt.t).toFixed(2)},${toY(pt.p).toFixed(2)}`)
        .join(" ");
      const last = s.points[s.points.length - 1];

      return {
        name: s.name,
        color: SERIES_COLORS[i % SERIES_COLORS.length],
        path,
        end: last ? { x: toX(last.t), y: toY(last.p), p: last.p } : null,
      };
    });

    const ticks = [0, 0.5, 1].map((fraction) => {
      const t = minT + fraction * span;
      return {
        x: toX(t),
        label: new Date(t * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    return {
      lines,
      domain: { min: minT, max: maxT },
      ticks,
      sampleCount: Math.max(...plotted.map((s) => s.points.length)),
    };
  }, [plotted]);

  if (lines.length === 0) return null;

  const innerW = VIEW_W - PAD.left - PAD.right;

  /** Map a pointer position onto the nearest sample index. */
  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || sampleCount < 2) return;

    const rect = svg.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const x = ratio * VIEW_W;
    const fraction = (x - PAD.left) / innerW;

    if (fraction < 0 || fraction > 1) {
      setHoverIndex(null);
      return;
    }
    setHoverIndex(Math.round(fraction * (sampleCount - 1)));
  };

  const hoverTime =
    hoverIndex === null
      ? null
      : domain.min + (hoverIndex / Math.max(sampleCount - 1, 1)) * (domain.max - domain.min);
  const hoverX =
    hoverIndex === null
      ? null
      : PAD.left + (hoverIndex / Math.max(sampleCount - 1, 1)) * innerW;

  return (
    <figure className="m-0">
      {/* Legend — identity is never carried by color alone. */}
      <figcaption className="flex flex-wrap items-center gap-4 mb-2 text-xs font-semibold text-zinc-600">
        {lines.map((line) => (
          <span key={line.name} className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ background: line.color }}
              aria-hidden
            />
            {line.name}
          </span>
        ))}
      </figcaption>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={`Price history: ${lines
          .map((l) => `${l.name} at ${Math.round((l.end?.p ?? 0) * 100)}%`)
          .join(", ")}`}
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {/* Recessive gridlines at 0 / 25 / 50 / 75 / 100% */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = PAD.top + (1 - p) * (VIEW_H - PAD.top - PAD.bottom);
          return (
            <g key={p}>
              <line
                x1={PAD.left}
                x2={VIEW_W - PAD.right}
                y1={y}
                y2={y}
                stroke="#e4e4e7"
                strokeWidth={1}
              />
              <text
                x={VIEW_W - PAD.right + 8}
                y={y + 4}
                className="fill-zinc-500"
                fontSize={11}
              >
                {p * 100}%
              </text>
            </g>
          );
        })}

        {/* Date ticks */}
        {ticks.map((tick, i) => (
          <text
            key={tick.label + i}
            x={tick.x}
            y={VIEW_H - 6}
            textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
            className="fill-zinc-500"
            fontSize={11}
          >
            {tick.label}
          </text>
        ))}

        {/* Crosshair */}
        {hoverX !== null && (
          <line
            x1={hoverX}
            x2={hoverX}
            y1={PAD.top}
            y2={VIEW_H - PAD.bottom}
            stroke="#a1a1aa"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {/* Series */}
        {lines.map((line) => (
          <path
            key={line.name}
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Direct labels at each line's end */}
        {lines.map((line) =>
          line.end ? (
            <g key={`${line.name}-label`}>
              <circle
                cx={line.end.x}
                cy={line.end.y}
                r={4}
                fill={line.color}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={line.end.x - 8}
                /* Flip below the point when the line ends near the top edge,
                   otherwise the label is clipped by the viewBox. */
                y={line.end.y > PAD.top + 22 ? line.end.y - 8 : line.end.y + 18}
                textAnchor="end"
                fontSize={13}
                fontWeight={700}
                fill={line.color}
              >
                {(line.end.p * 100).toFixed(1)}%
              </text>
            </g>
          ) : null
        )}
      </svg>

      {/* Tooltip readout — kept in normal text tokens, color only on the swatch. */}
      <div
        className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 min-h-5"
        role="status"
      >
        {hoverTime !== null && (
          <>
            <span className="font-semibold text-zinc-900">
              {new Date(hoverTime * 1000).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
              })}
            </span>
            {plotted.map((s, i) => {
              const point = s.points[Math.min(hoverIndex ?? 0, s.points.length - 1)];
              return (
                <span key={s.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                    aria-hidden
                  />
                  {s.name} {((point?.p ?? 0) * 100).toFixed(1)}%
                </span>
              );
            })}
          </>
        )}
      </div>
    </figure>
  );
}
