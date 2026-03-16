import { NextResponse } from "next/server";
import { searchMarkets } from "@/lib/api/polymarket";

export async function GET() {
  try {
    const markets = await searchMarkets("f1", 50);
    return NextResponse.json({ data: markets, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch market data", details: String(error) },
      { status: 500 }
    );
  }
}
