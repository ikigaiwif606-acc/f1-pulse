import { NextResponse } from "next/server";
import { getRacesList } from "@/lib/data/races";

export async function GET() {
  try {
    const races = await getRacesList();
    return NextResponse.json({ data: races, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch race data", details: String(error) },
      { status: 500 }
    );
  }
}
