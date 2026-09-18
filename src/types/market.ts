/**
 * The subset of market data the list views need. Lists are projected down to
 * this shape before crossing the server/client boundary, because the upstream
 * objects carry long descriptions and token metadata that would bloat the
 * serialized payload many times over.
 */
export interface MarketSummary {
  id: string;
  question: string;
  image?: string;
  /** Already parsed and truncated to the outcomes a card displays. */
  outcomes: Outcome[];
  volume: number;
  endDate?: string;
}

export interface Outcome {
  name: string;
  /** Implied probability as a fraction between 0 and 1. */
  price: number;
}

/**
 * A full market as returned by the Polymarket Gamma API. Only the fields the
 * app reads are declared; the API returns many more. Numeric values arrive as
 * strings in some places and numbers in others, so they are normalised in
 * `lib/format.ts`.
 */
export interface Market {
  id: string;
  question: string;
  slug: string;
  description?: string;

  /** JSON-encoded arrays, e.g. '["Yes", "No"]' and '["0.04", "0.96"]'. */
  outcomes: string;
  outcomePrices: string;

  volume?: string;
  volumeNum?: number;
  endDate?: string;

  active: boolean;
  closed: boolean;

  // Volume / liquidity
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  liquidity?: string;
  liquidityNum?: number;

  // Dates (ISO 8601)
  startDate?: string;
  createdAt?: string;
  updatedAt?: string;

  // Status
  acceptingOrders?: boolean;
  enableOrderBook?: boolean;
  negRisk?: boolean;

  // Price movement (fractions, e.g. -0.005 === -0.5%)
  oneHourPriceChange?: number;
  oneDayPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;

  // Order book
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
  orderMinSize?: number;
  orderPriceMinTickSize?: number;
  competitive?: number;

  image?: string;
  icon?: string;

  // Identifiers
  conditionId?: string;
  questionID?: string;
  /** JSON-encoded array of CLOB token ids, one per outcome. */
  clobTokenIds?: string;

  events?: MarketEvent[];
}

export interface MarketEvent {
  id: string;
  title: string;
  slug?: string;
  commentCount?: number;
  tags?: { id: string; label: string; slug: string }[];
  description?: string;
  volume?: number;
  liquidity?: number;
  startDate?: string;
  endDate?: string;
  image?: string;
}

/** One point on a market's price history. */
export interface PricePoint {
  /** Unix timestamp in seconds. */
  t: number;
  /** Price as a fraction between 0 and 1. */
  p: number;
}

/** A named outcome plus the price history of its CLOB token. */
export interface OutcomeSeries {
  name: string;
  price: number;
  points: PricePoint[];
}

/** A top-level Polymarket category, backed by a real tag id. */
export interface Category {
  label: string;
  slug: string;
  /** `null` for the default "Trending" view, which applies no tag filter. */
  tagId: number | null;
}

/** One side of the CLOB order book. */
export interface BookLevel {
  price: number;
  size: number;
}

export interface OrderBook {
  bids: BookLevel[];
  asks: BookLevel[];
}

/** A comment on the market's parent event. */
export interface MarketComment {
  id: string;
  body: string;
  createdAt: string;
  reactionCount?: number;
  authorName: string;
  authorImage?: string;
}

/** A wallet holding one of the market's outcome tokens. */
export interface Holder {
  address: string;
  name: string;
  image?: string;
  amount: number;
  outcome: string;
}

/** A filled trade on the market. */
export interface Trade {
  id: string;
  side: "BUY" | "SELL";
  outcome: string;
  size: number;
  price: number;
  timestamp: number;
  name: string;
  image?: string;
}
