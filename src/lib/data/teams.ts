import { getConstructorStandings } from "@/lib/api/ergast";
import { transformErgastConstructorStandings } from "./transformers";
import type { TeamListItem } from "@/types";

// ── Fallback data (2026 fictional season) ──────────────────────
const FALLBACK_TEAMS: TeamListItem[] = [
  { id: "mercedes", name: "Mercedes-AMG Petronas", drivers: ["Russell", "Antonelli"], pts: 88, wins: 2, podiums: 4, pos: 1, color: "#27F4D2" },
  { id: "ferrari", name: "Scuderia Ferrari", drivers: ["Leclerc", "Hamilton"], pts: 53, wins: 0, podiums: 3, pos: 2, color: "#E80020" },
  { id: "mclaren", name: "McLaren F1 Team", drivers: ["Norris", "Piastri"], pts: 48, wins: 0, podiums: 1, pos: 3, color: "#FF8000" },
  { id: "redbull", name: "Oracle Red Bull Racing", drivers: ["Verstappen", "Tsunoda"], pts: 33, wins: 0, podiums: 1, pos: 4, color: "#3671C6" },
  { id: "aston_martin", name: "Aston Martin Aramco", drivers: ["Alonso", "Stroll"], pts: 14, wins: 0, podiums: 0, pos: 5, color: "#229971" },
  { id: "audi", name: "Audi F1 Team", drivers: ["Hülkenberg", "Bortoleto"], pts: 14, wins: 0, podiums: 0, pos: 6, color: "#00594F" },
  { id: "alpine", name: "Alpine F1 Team", drivers: ["Gasly", "Doohan"], pts: 8, wins: 0, podiums: 0, pos: 7, color: "#0093CC" },
  { id: "haas", name: "MoneyGram Haas F1", drivers: ["Ocon", "Bearman"], pts: 5, wins: 0, podiums: 0, pos: 8, color: "#B6BABD" },
  { id: "williams", name: "Williams Racing", drivers: ["Sainz", "Albon"], pts: 4, wins: 0, podiums: 0, pos: 9, color: "#1868DB" },
  { id: "cadillac", name: "Cadillac F1 Team", drivers: ["TBD", "TBD"], pts: 0, wins: 0, podiums: 0, pos: 10, color: "#C0C0C0" },
];

export async function getTeamsList(): Promise<TeamListItem[]> {
  try {
    for (const season of [2025, 2024]) {
      const data = await getConstructorStandings(season);
      const teams = transformErgastConstructorStandings(data);
      if (teams.length > 0) return teams;
    }
    return FALLBACK_TEAMS;
  } catch {
    return FALLBACK_TEAMS;
  }
}

export async function getTeamDetail(id: string): Promise<TeamListItem | null> {
  const teams = await getTeamsList();
  return teams.find((t) => t.id === id) || null;
}
