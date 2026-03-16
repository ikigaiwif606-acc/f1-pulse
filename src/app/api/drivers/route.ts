import { NextResponse } from "next/server";
import { getChampionshipDrivers } from "@/lib/api/openf1";

export async function GET() {
  try {
    const drivers = await getChampionshipDrivers({ year: "2026" });
    return NextResponse.json({ data: drivers, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch driver data", details: String(error) },
      { status: 500 }
    );
  }
}
