import { getConstructorStandings } from "@/lib/api/ergast";
import { transformErgastConstructorStandings } from "./transformers";
import type { TeamListItem } from "@/types";

// ── Fallback data (2026 season after R2) ───────────────────────
const FALLBACK_TEAMS: TeamListItem[] = [
  { id: "mercedes", name: "Mercedes", drivers: ["Russell", "Antonelli"], pts: 98, wins: 2, podiums: 4, pos: 1, color: "#27F4D2" },
  { id: "ferrari", name: "Ferrari", drivers: ["Leclerc", "Hamilton"], pts: 67, wins: 0, podiums: 3, pos: 2, color: "#E80020" },
  { id: "mclaren", name: "McLaren", drivers: ["Norris", "Piastri"], pts: 18, wins: 0, podiums: 0, pos: 3, color: "#FF8000" },
  { id: "haas", name: "Haas F1 Team", drivers: ["Bearman", "Ocon"], pts: 17, wins: 0, podiums: 0, pos: 4, color: "#B6BABD" },
  { id: "red_bull", name: "Red Bull", drivers: ["Verstappen", "Hadjar"], pts: 12, wins: 0, podiums: 0, pos: 5, color: "#3671C6" },
  { id: "rb", name: "Racing Bulls", drivers: ["Lawson", "Lindblad"], pts: 12, wins: 0, podiums: 0, pos: 6, color: "#6692FF" },
  { id: "alpine", name: "Alpine F1 Team", drivers: ["Gasly", "Colapinto"], pts: 10, wins: 0, podiums: 0, pos: 7, color: "#0093CC" },
  { id: "sauber", name: "Audi", drivers: ["Bortoleto", "Hülkenberg"], pts: 2, wins: 0, podiums: 0, pos: 8, color: "#00594F" },
  { id: "williams", name: "Williams", drivers: ["Sainz", "Albon"], pts: 2, wins: 0, podiums: 0, pos: 9, color: "#1868DB" },
  { id: "cadillac", name: "Cadillac F1 Team", drivers: ["Bottas", "Pérez"], pts: 0, wins: 0, podiums: 0, pos: 10, color: "#C0C0C0" },
  { id: "aston_martin", name: "Aston Martin", drivers: ["Alonso", "Stroll"], pts: 0, wins: 0, podiums: 0, pos: 11, color: "#229971" },
];

export async function getTeamsList(): Promise<TeamListItem[]> {
  try {
    // Try 2026 season — if the API has real data, use it; otherwise fallback
    const data = await getConstructorStandings(2026);
    const teams = transformErgastConstructorStandings(data);
    if (teams.length > 0) return teams;
    return FALLBACK_TEAMS;
  } catch {
    return FALLBACK_TEAMS;
  }
}

export async function getTeamDetail(id: string): Promise<TeamListItem | null> {
  const teams = await getTeamsList();
  return teams.find((t) => t.id === id) || null;
}
