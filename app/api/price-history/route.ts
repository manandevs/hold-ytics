import { NextResponse } from "next/server";
import { getPriceHistory, REVALIDATE_SECONDS } from "@/lib/api";
import { isInterval } from "@/lib/intervals";

/**
 * Price history for one CLOB token, used when the reader switches the chart's
 * time range. Tokens come straight from the market, so only the interval needs
 * validating against the known set.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tokens = searchParams.getAll("token").filter(Boolean).slice(0, 4);
  const interval = searchParams.get("interval") ?? "1w";

  if (tokens.length === 0) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }
  if (!isInterval(interval)) {
    return NextResponse.json({ error: "unknown interval" }, { status: 400 });
  }

  try {
    const series = await Promise.all(
      tokens.map((token) => getPriceHistory(token, interval))
    );

    return NextResponse.json(
      { series },
      {
        headers: {
          "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
        },
      }
    );
  } catch (error) {
    console.error("GET /api/price-history failed:", error);
    return NextResponse.json({ error: "Failed to load price history" }, { status: 502 });
  }
}
