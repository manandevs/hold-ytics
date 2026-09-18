import { BookLevel, Holder, MarketComment, OrderBook, Trade } from "@/types/market";
import { CLOB_API, DATA_API, fetchJson, GAMMA_API } from "./client";

/** Live order book for one outcome token. */
export async function getOrderBook(tokenId: string): Promise<OrderBook> {
  const empty: OrderBook = { bids: [], asks: [] };
  if (!tokenId) return empty;

  const data = await fetchJson<{
    bids?: { price: string; size: string }[];
    asks?: { price: string; size: string }[];
  }>(`${CLOB_API}/book?token_id=${encodeURIComponent(tokenId)}`);
  if (!data) return empty;

  const toLevels = (rows?: { price: string; size: string }[]): BookLevel[] =>
    (rows ?? [])
      .map((row) => ({ price: Number(row.price), size: Number(row.size) }))
      .filter((row) => Number.isFinite(row.price) && Number.isFinite(row.size));

  // The API returns bids ascending and asks descending; surface best-first.
  return {
    bids: toLevels(data.bids).sort((a, b) => b.price - a.price),
    asks: toLevels(data.asks).sort((a, b) => a.price - b.price),
  };
}

/** Comments posted on the market's parent event. */
export async function getComments(eventId: string, limit = 20): Promise<MarketComment[]> {
  if (!eventId) return [];

  const url =
    `${GAMMA_API}/comments?parent_entity_type=Event` +
    `&parent_entity_id=${encodeURIComponent(eventId)}` +
    `&limit=${limit}&order=createdAt&ascending=false`;

  const data = await fetchJson<
    {
      id: string;
      body: string;
      createdAt: string;
      reactionCount?: number;
      profile?: { name?: string; pseudonym?: string; profileImage?: string };
    }[]
  >(url);
  if (!Array.isArray(data)) return [];

  return data
    .filter((row) => row?.id && row.body)
    .map((row) => ({
      id: row.id,
      body: row.body,
      createdAt: row.createdAt,
      reactionCount: row.reactionCount,
      authorName: row.profile?.name || row.profile?.pseudonym || "Anonymous",
      authorImage: row.profile?.profileImage,
    }));
}

/** Largest holders of each outcome token. */
export async function getHolders(
  conditionId: string,
  outcomeNames: string[],
  limit = 10
): Promise<Holder[]> {
  if (!conditionId) return [];

  const data = await fetchJson<
    {
      holders?: {
        proxyWallet?: string;
        name?: string;
        pseudonym?: string;
        profileImage?: string;
        amount?: number;
        outcomeIndex?: number;
      }[];
    }[]
  >(`${DATA_API}/holders?market=${encodeURIComponent(conditionId)}&limit=${limit}`);
  if (!Array.isArray(data)) return [];

  return data
    .flatMap((group) => group?.holders ?? [])
    .filter((holder) => holder?.proxyWallet && Number.isFinite(holder.amount))
    .map((holder) => ({
      address: holder.proxyWallet as string,
      name: holder.name || holder.pseudonym || "Anonymous",
      image: holder.profileImage,
      amount: holder.amount as number,
      outcome: outcomeNames[holder.outcomeIndex ?? 0] ?? "-",
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/** Most recent fills on the market. */
export async function getTrades(conditionId: string, limit = 20): Promise<Trade[]> {
  if (!conditionId) return [];

  const data = await fetchJson<
    {
      transactionHash?: string;
      side?: string;
      outcome?: string;
      size?: number;
      price?: number;
      timestamp?: number;
      name?: string;
      pseudonym?: string;
      profileImage?: string;
    }[]
  >(`${DATA_API}/trades?market=${encodeURIComponent(conditionId)}&limit=${limit}`);
  if (!Array.isArray(data)) return [];

  return data
    .filter((row) => Number.isFinite(row?.price) && Number.isFinite(row?.timestamp))
    .map((row, i) => ({
      id: `${row.transactionHash ?? "trade"}-${i}`,
      side: row.side === "SELL" ? ("SELL" as const) : ("BUY" as const),
      outcome: row.outcome || "-",
      size: row.size ?? 0,
      price: row.price as number,
      timestamp: row.timestamp as number,
      name: row.name || row.pseudonym || "Anonymous",
      image: row.profileImage,
    }));
}
