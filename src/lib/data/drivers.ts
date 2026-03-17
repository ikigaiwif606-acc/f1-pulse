import { getDriverStandings } from "@/lib/api/ergast";
import { transformErgastDriverStandings } from "./transformers";
import type { DriverListItem } from "@/types";

// ── Fallback data (2026 season after R2) ───────────────────────
const FALLBACK_DRIVERS: DriverListItem[] = [
  { id: "russell", name: "George Russell", code: "RUS", team: "Mercedes", number: 63, pts: 51, wins: 1, podiums: 2, poles: 1, pos: 1, color: "#27F4D2" },
  { id: "antonelli", name: "Andrea Kimi Antonelli", code: "ANT", team: "Mercedes", number: 12, pts: 47, wins: 1, podiums: 2, poles: 1, pos: 2, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", team: "Ferrari", number: 16, pts: 34, wins: 0, podiums: 2, poles: 0, pos: 3, color: "#E80020" },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", team: "Ferrari", number: 44, pts: 33, wins: 0, podiums: 1, poles: 0, pos: 4, color: "#E80020" },
  { id: "bearman", name: "Oliver Bearman", code: "BEA", team: "Haas F1 Team", number: 87, pts: 17, wins: 0, podiums: 0, poles: 0, pos: 5, color: "#B6BABD" },
  { id: "norris", name: "Lando Norris", code: "NOR", team: "McLaren", number: 1, pts: 15, wins: 0, podiums: 0, poles: 0, pos: 6, color: "#FF8000" },
  { id: "gasly", name: "Pierre Gasly", code: "GAS", team: "Alpine F1 Team", number: 10, pts: 9, wins: 0, podiums: 0, poles: 0, pos: 7, color: "#0093CC" },
  { id: "verstappen", name: "Max Verstappen", code: "VER", team: "Red Bull", number: 3, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 8, color: "#3671C6" },
  { id: "lawson", name: "Liam Lawson", code: "LAW", team: "Racing Bulls", number: 30, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 9, color: "#6692FF" },
  { id: "lindblad", name: "Arvid Lindblad", code: "LIN", team: "Racing Bulls", number: 41, pts: 4, wins: 0, podiums: 0, poles: 0, pos: 10, color: "#6692FF" },
  { id: "hadjar", name: "Isack Hadjar", code: "HAD", team: "Red Bull", number: 6, pts: 4, wins: 0, podiums: 0, poles: 0, pos: 11, color: "#3671C6" },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", team: "McLaren", number: 81, pts: 3, wins: 0, podiums: 0, poles: 0, pos: 12, color: "#FF8000" },
  { id: "sainz", name: "Carlos Sainz", code: "SAI", team: "Williams", number: 55, pts: 2, wins: 0, podiums: 0, poles: 0, pos: 13, color: "#1868DB" },
  { id: "bortoleto", name: "Gabriel Bortoleto", code: "BOR", team: "Audi", number: 5, pts: 2, wins: 0, podiums: 0, poles: 0, pos: 14, color: "#00594F" },
  { id: "colapinto", name: "Franco Colapinto", code: "COL", team: "Alpine F1 Team", number: 43, pts: 1, wins: 0, podiums: 0, poles: 0, pos: 15, color: "#0093CC" },
  { id: "ocon", name: "Esteban Ocon", code: "OCO", team: "Haas F1 Team", number: 31, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 16, color: "#B6BABD" },
  { id: "hulkenberg", name: "Nico Hülkenberg", code: "HUL", team: "Audi", number: 27, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 17, color: "#00594F" },
  { id: "albon", name: "Alexander Albon", code: "ALB", team: "Williams", number: 23, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 18, color: "#1868DB" },
  { id: "bottas", name: "Valtteri Bottas", code: "BOT", team: "Cadillac F1 Team", number: 77, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 19, color: "#C0C0C0" },
  { id: "perez", name: "Sergio Pérez", code: "PER", team: "Cadillac F1 Team", number: 11, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 20, color: "#C0C0C0" },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", team: "Aston Martin", number: 14, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 21, color: "#229971" },
  { id: "stroll", name: "Lance Stroll", code: "STR", team: "Aston Martin", number: 18, pts: 0, wins: 0, podiums: 0, poles: 0, pos: 22, color: "#229971" },
];

export async function getDriversList(): Promise<DriverListItem[]> {
  try {
    // Try 2026 season — if the API has real data, use it; otherwise fallback
    const data = await getDriverStandings(2026);
    const drivers = transformErgastDriverStandings(data);
    if (drivers.length > 0) return drivers;
    return FALLBACK_DRIVERS;
  } catch {
    return FALLBACK_DRIVERS;
  }
}

export async function getDriverDetail(id: string): Promise<DriverListItem | null> {
  const drivers = await getDriversList();
  return drivers.find((d) => d.id === id) || null;
}
