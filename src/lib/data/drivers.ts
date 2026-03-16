import { getDriverStandings } from "@/lib/api/ergast";
import { transformErgastDriverStandings } from "./transformers";
import type { DriverListItem } from "@/types";

// ── Fallback data (2026 fictional season) ──────────────────────
const FALLBACK_DRIVERS: DriverListItem[] = [
  { id: "russell", name: "George Russell", code: "RUS", team: "Mercedes", number: 63, pts: 51, wins: 2, podiums: 2, poles: 2, pos: 1, color: "#27F4D2" },
  { id: "antonelli", name: "Kimi Antonelli", code: "ANT", team: "Mercedes", number: 12, pts: 37, wins: 1, podiums: 2, poles: 0, pos: 2, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", team: "Ferrari", number: 16, pts: 31, wins: 0, podiums: 2, poles: 0, pos: 3, color: "#E80020" },
  { id: "norris", name: "Lando Norris", code: "NOR", team: "McLaren", number: 4, pts: 28, wins: 0, podiums: 1, poles: 0, pos: 4, color: "#FF8000" },
  { id: "verstappen", name: "Max Verstappen", code: "VER", team: "Red Bull", number: 1, pts: 25, wins: 0, podiums: 1, poles: 0, pos: 5, color: "#3671C6" },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", team: "Ferrari", number: 44, pts: 22, wins: 0, podiums: 1, poles: 0, pos: 6, color: "#E80020" },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", team: "McLaren", number: 81, pts: 20, wins: 0, podiums: 0, poles: 0, pos: 7, color: "#FF8000" },
  { id: "hulkenberg", name: "Nico Hülkenberg", code: "HUL", team: "Audi", number: 27, pts: 12, wins: 0, podiums: 0, poles: 0, pos: 8, color: "#00594F" },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", team: "Aston Martin", number: 14, pts: 10, wins: 0, podiums: 0, poles: 0, pos: 9, color: "#229971" },
  { id: "tsunoda", name: "Yuki Tsunoda", code: "TSU", team: "Red Bull", number: 22, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 10, color: "#3671C6" },
];

export async function getDriversList(): Promise<DriverListItem[]> {
  try {
    for (const season of [2025, 2024]) {
      const data = await getDriverStandings(season);
      const drivers = transformErgastDriverStandings(data);
      if (drivers.length > 0) return drivers;
    }
    return FALLBACK_DRIVERS;
  } catch {
    return FALLBACK_DRIVERS;
  }
}

export async function getDriverDetail(id: string): Promise<DriverListItem | null> {
  const drivers = await getDriversList();
  return drivers.find((d) => d.id === id) || null;
}
