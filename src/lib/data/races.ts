import { getSessions } from "@/lib/api/openf1";
import { transformOpenF1Sessions } from "./transformers";
import type { RaceListItem } from "@/types";

// ── Fallback data (2026 season — full 24-race calendar) ────────
const FALLBACK_RACES: RaceListItem[] = [
  { slug: "australian-gp", round: 1, name: "Australian Grand Prix", circuit: "Melbourne", date: "MAR 08", isoDate: "2026-03-08T04:00:00Z", winner: "Russell", code: "RUS", color: "#27F4D2", completed: true },
  { slug: "chinese-gp", round: 2, name: "Chinese Grand Prix", circuit: "Shanghai", date: "MAR 15", isoDate: "2026-03-15T07:00:00Z", winner: "Antonelli", code: "ANT", color: "#27F4D2", completed: true, sprint: true },
  { slug: "japanese-gp", round: 3, name: "Japanese Grand Prix", circuit: "Suzuka", date: "MAR 29", isoDate: "2026-03-29T05:00:00Z", next: true, completed: false },
  { slug: "bahrain-gp", round: 4, name: "Bahrain Grand Prix", circuit: "Sakhir", date: "APR 12", isoDate: "2026-04-12T15:00:00Z", completed: false },
  { slug: "saudi-arabian-gp", round: 5, name: "Saudi Arabian Grand Prix", circuit: "Jeddah", date: "APR 19", isoDate: "2026-04-19T17:00:00Z", completed: false },
  { slug: "miami-gp", round: 6, name: "Miami Grand Prix", circuit: "Miami", date: "MAY 03", isoDate: "2026-05-03T19:30:00Z", completed: false, sprint: true },
  { slug: "canadian-gp", round: 7, name: "Canadian Grand Prix", circuit: "Montreal", date: "MAY 24", isoDate: "2026-05-24T18:00:00Z", completed: false, sprint: true },
  { slug: "monaco-gp", round: 8, name: "Monaco Grand Prix", circuit: "Monte Carlo", date: "JUN 07", isoDate: "2026-06-07T13:00:00Z", completed: false },
  { slug: "spanish-gp", round: 9, name: "Spanish Grand Prix", circuit: "Catalunya", date: "JUN 14", isoDate: "2026-06-14T13:00:00Z", completed: false },
  { slug: "austrian-gp", round: 10, name: "Austrian Grand Prix", circuit: "Spielberg", date: "JUN 28", isoDate: "2026-06-28T13:00:00Z", completed: false },
  { slug: "british-gp", round: 11, name: "British Grand Prix", circuit: "Silverstone", date: "JUL 05", isoDate: "2026-07-05T14:00:00Z", completed: false, sprint: true },
  { slug: "belgian-gp", round: 12, name: "Belgian Grand Prix", circuit: "Spa-Francorchamps", date: "JUL 19", isoDate: "2026-07-19T13:00:00Z", completed: false },
  { slug: "hungarian-gp", round: 13, name: "Hungarian Grand Prix", circuit: "Hungaroring", date: "JUL 26", isoDate: "2026-07-26T13:00:00Z", completed: false },
  { slug: "dutch-gp", round: 14, name: "Dutch Grand Prix", circuit: "Zandvoort", date: "AUG 23", isoDate: "2026-08-23T13:00:00Z", completed: false, sprint: true },
  { slug: "italian-gp", round: 15, name: "Italian Grand Prix", circuit: "Monza", date: "SEP 06", isoDate: "2026-09-06T13:00:00Z", completed: false },
  { slug: "madrid-gp", round: 16, name: "Madrid Grand Prix", circuit: "Madring", date: "SEP 13", isoDate: "2026-09-13T13:00:00Z", completed: false },
  { slug: "azerbaijan-gp", round: 17, name: "Azerbaijan Grand Prix", circuit: "Baku", date: "SEP 26", isoDate: "2026-09-26T11:00:00Z", completed: false },
  { slug: "singapore-gp", round: 18, name: "Singapore Grand Prix", circuit: "Singapore", date: "OCT 11", isoDate: "2026-10-11T12:00:00Z", completed: false, sprint: true },
  { slug: "united-states-gp", round: 19, name: "United States Grand Prix", circuit: "Austin", date: "OCT 25", isoDate: "2026-10-25T19:00:00Z", completed: false },
  { slug: "mexico-city-gp", round: 20, name: "Mexico City Grand Prix", circuit: "Mexico City", date: "NOV 01", isoDate: "2026-11-01T20:00:00Z", completed: false },
  { slug: "brazilian-gp", round: 21, name: "Brazilian Grand Prix", circuit: "Interlagos", date: "NOV 08", isoDate: "2026-11-08T17:00:00Z", completed: false },
  { slug: "las-vegas-gp", round: 22, name: "Las Vegas Grand Prix", circuit: "Las Vegas", date: "NOV 22", isoDate: "2026-11-22T06:00:00Z", completed: false },
  { slug: "qatar-gp", round: 23, name: "Qatar Grand Prix", circuit: "Lusail", date: "NOV 29", isoDate: "2026-11-29T14:00:00Z", completed: false },
  { slug: "abu-dhabi-gp", round: 24, name: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", date: "DEC 06", isoDate: "2026-12-06T13:00:00Z", completed: false },
];

export async function getRacesList(): Promise<RaceListItem[]> {
  try {
    // Try 2026 season — if the API has real data, use it; otherwise fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions = (await getSessions({ year: "2026" })) as any[];
    const races = transformOpenF1Sessions(sessions);
    if (races.length > 0) return races;
    return FALLBACK_RACES;
  } catch {
    return FALLBACK_RACES;
  }
}

export async function getRaceDetail(slug: string): Promise<RaceListItem | null> {
  const races = await getRacesList();
  return races.find((r) => r.slug === slug) || null;
}
