import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/data/markets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const markets = await getMarkets(category);
    return NextResponse.json({ data: markets, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch market data", details: String(error) },
      { status: 500 }
    );
  }
}
