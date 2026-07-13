import { NextResponse } from "next/server";
import { getMarketsMeta } from "@/lib/data/markets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const { data, stale, timestamp } = await getMarketsMeta(category);
    return NextResponse.json({ data, stale, timestamp, cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch market data", details: String(error) },
      { status: 500 }
    );
  }
}
