import { NextResponse } from "next/server";
import { getChampionshipTeams } from "@/lib/api/openf1";

export async function GET() {
  try {
    const teams = await getChampionshipTeams({ year: "2026" });
    return NextResponse.json({ data: teams, timestamp: new Date().toISOString(), cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch team data", details: String(error) },
      { status: 500 }
    );
  }
}
