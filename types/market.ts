export interface Market {
  id: string;
  question: string;
  slug: string;

  // Core
  description: string;
  category?: string;

  // Pricing
  outcomes: string;
  outcomePrices: string;

  // Metrics
  volume: string;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;

  liquidity: string;
  liquidityNum?: number;

  // Time
  startDate: string;
  endDate: string;

  // Status
  active: boolean;
  closed: boolean;

  // Price movement
  oneDayPriceChange?: number;
  oneHourPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;

  // Orderbook
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;

  // Media
  image?: string;
  icon?: string;

  // Events (important)
  events?: MarketEvent[];

  // Extra useful flags
  acceptingOrders?: boolean;
}

export interface MarketEvent {
  id: string;
  title: string;
  description?: string;
  volume?: number;
  liquidity?: number;
  startDate?: string;
  endDate?: string;
  image?: string;
}