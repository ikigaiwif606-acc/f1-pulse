import { NextResponse } from "next/server";
import { getSessions } from "@/lib/api/openf1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") || "2026";

  try {
    const sessions = await getSessions({ year: season });
    return NextResponse.json({ data: sessions, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch race data", details: String(error) },
      { status: 500 }
    );
  }
}
