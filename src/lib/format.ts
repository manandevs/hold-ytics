import { Outcome } from "@/types/market";

/** Coerce an unknown API value to a finite number, or `null` when it isn't one. */
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/** Compact currency, e.g. `$13.5M`. Returns a dash when the value is missing. */
export function formatCurrency(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: num >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: num >= 1_000_000 ? 1 : 0,
  });
}

/** A price fraction (0–1) rendered as a percentage, e.g. `3.9%`. */
export function formatPercent(value: unknown, fractionDigits = 1): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return `${(num * 100).toFixed(fractionDigits)}%`;
}

/** A signed percentage change, e.g. `+0.50%`. */
export function formatChange(value: unknown, fractionDigits = 2): string {
  const num = toNumber(value);
  if (num === null) return "—";
  const percent = num * 100;
  return `${percent > 0 ? "+" : ""}${percent.toFixed(fractionDigits)}%`;
}

/** A raw number with thousands separators. */
export function formatNumber(value: unknown, maximumFractionDigits = 3): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return num.toLocaleString("en-US", { maximumFractionDigits });
}

/** Short date, e.g. `Jan 1, 2027`. */
export function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Date with time, used for created/updated timestamps. */
export function formatDateTime(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Parse the JSON-encoded `outcomes` / `outcomePrices` pair into aligned arrays.
 * Malformed payloads yield empty arrays rather than throwing.
 */
export function parseOutcomes(outcomes?: string, outcomePrices?: string): Outcome[] {
  let names: unknown;
  let prices: unknown;

  try {
    names = JSON.parse(outcomes || "[]");
    prices = JSON.parse(outcomePrices || "[]");
  } catch {
    return [];
  }

  if (!Array.isArray(names)) return [];
  const priceList = Array.isArray(prices) ? prices : [];

  return names.map((name, i) => ({
    name: String(name),
    price: toNumber(priceList[i]) ?? 0,
  }));
}
