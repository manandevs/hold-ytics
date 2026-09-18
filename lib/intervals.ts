/** Chart time ranges, shared by the picker, the API route and the fetcher. */
export const INTERVALS = [
  { value: "1h", label: "1H", fidelity: 1 },
  { value: "6h", label: "6H", fidelity: 5 },
  { value: "1d", label: "1D", fidelity: 15 },
  { value: "1w", label: "1W", fidelity: 60 },
  { value: "1m", label: "1M", fidelity: 360 },
  { value: "max", label: "ALL", fidelity: 720 },
] as const;

export type Interval = (typeof INTERVALS)[number]["value"];

export const DEFAULT_INTERVAL: Interval = "1w";

export function isInterval(value: string): value is Interval {
  return INTERVALS.some((i) => i.value === value);
}

/** Bucket size in minutes that keeps each range at a readable point count. */
export function fidelityFor(interval: Interval): number {
  return INTERVALS.find((i) => i.value === interval)?.fidelity ?? 60;
}
