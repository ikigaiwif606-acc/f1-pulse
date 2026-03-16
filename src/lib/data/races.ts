import { getSessions } from "@/lib/api/openf1";
import { transformOpenF1Sessions } from "./transformers";
import type { RaceListItem } from "@/types";

// ── Fallback data (2026 fictional season) ──────────────────────
const FALLBACK_RACES: RaceListItem[] = [
  { slug: "australian-gp", round: 1, name: "Australian Grand Prix", circuit: "Melbourne", date: "MAR 06", winner: "Russell", code: "RUS", color: "#27F4D2", completed: true },
  { slug: "chinese-gp", round: 2, name: "Chinese Grand Prix", circuit: "Shanghai", date: "MAR 13", winner: "Antonelli", code: "ANT", color: "#27F4D2", completed: true },
  { slug: "japanese-gp", round: 3, name: "Japanese Grand Prix", circuit: "Suzuka", date: "MAR 29", next: true, completed: false },
  { slug: "emilia-romagna-gp", round: 4, name: "Emilia Romagna Grand Prix", circuit: "Imola", date: "APR 12", completed: false },
  { slug: "miami-gp", round: 5, name: "Miami Grand Prix", circuit: "Miami", date: "MAY 03", sprint: true, completed: false },
  { slug: "spanish-gp", round: 6, name: "Spanish Grand Prix", circuit: "Barcelona", date: "MAY 17", completed: false },
  { slug: "monaco-gp", round: 7, name: "Monaco Grand Prix", circuit: "Monte Carlo", date: "MAY 24", completed: false },
  { slug: "canadian-gp", round: 8, name: "Canadian Grand Prix", circuit: "Montreal", date: "JUN 07", completed: false },
  { slug: "austrian-gp", round: 9, name: "Austrian Grand Prix", circuit: "Spielberg", date: "JUN 21", sprint: true, completed: false },
  { slug: "british-gp", round: 10, name: "British Grand Prix", circuit: "Silverstone", date: "JUL 05", completed: false },
  { slug: "belgian-gp", round: 11, name: "Belgian Grand Prix", circuit: "Spa", date: "JUL 19", completed: false },
  { slug: "hungarian-gp", round: 12, name: "Hungarian Grand Prix", circuit: "Budapest", date: "AUG 02", completed: false },
];

export async function getRacesList(): Promise<RaceListItem[]> {
  try {
    // Try 2025 first (latest real season), then 2024
    for (const year of ["2025", "2024"]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessions = (await getSessions({ year })) as any[];
      const races = transformOpenF1Sessions(sessions);
      if (races.length > 0) return races;
    }
    return FALLBACK_RACES;
  } catch {
    return FALLBACK_RACES;
  }
}

export async function getRaceDetail(slug: string): Promise<RaceListItem | null> {
  const races = await getRacesList();
  return races.find((r) => r.slug === slug) || null;
}
