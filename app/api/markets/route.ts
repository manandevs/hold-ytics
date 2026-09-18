import { NextResponse } from "next/server";
import { getMarkets, REVALIDATE_SECONDS } from "@/lib/api";

/**
 * Live market feed used by the client-side poller. Mirrors the parameters of
 * `getMarkets` so the client can refresh the exact slice the server rendered.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const query = searchParams.get("q") ?? undefined;
  const rawTag = searchParams.get("tag_id");
  const tagId = rawTag === null ? null : Number.parseInt(rawTag, 10);

  try {
    const markets = await getMarkets({
      limit,
      offset,
      query,
      tagId: Number.isFinite(tagId as number) ? tagId : null,
    });
    return NextResponse.json(markets, {
      headers: {
        "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json({ error: "Failed to load markets" }, { status: 502 });
  }
}
