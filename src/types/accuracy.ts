/** Accuracy of resolved markets, measured at a fixed lookback before they closed. */
export interface HorizonStat {
  id: string;
  /** Human label, e.g. "4 hours". */
  label: string;
  sampleSize: number;
  /** Mean squared error between price and outcome. Lower is better; 0 is perfect. */
  brier: number;
  /** Share of markets whose favourite matched the resolved outcome, 0–1. */
  accuracy: number;
}

/** One probability band of the calibration (expected vs actual) chart. */
export interface CalibrationBucket {
  /** Band bounds as percentages, e.g. 30 and 40. */
  lower: number;
  upper: number;
  sampleSize: number;
  /** Mean price the market quoted in this band, 0–1. */
  expected: number;
  /** Share of those markets that actually resolved Yes, 0–1. */
  actual: number;
}

/** Brier score for one quartile of the sample by trading volume. */
export interface VolumeBucket {
  label: string;
  sampleSize: number;
  brier: number;
  minVolume: number;
  maxVolume: number;
}

export interface AccuracyReport {
  /** Markets that produced a usable score. */
  sampleSize: number;
  /** Resolved markets that passed the filters before sampling. */
  candidatePool: number;
  /** Minimum traded volume a market needed to be considered. */
  minVolume: number;
  horizons: HorizonStat[];
  /** Calibration bands keyed by horizon id. */
  calibration: Record<string, CalibrationBucket[]>;
  volumeBuckets: VolumeBucket[];
  resolution: { yes: number; no: number };
}
