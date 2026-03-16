import { getRacesList } from "./races";
import { getDriversList } from "./drivers";
import type { HomepageData } from "@/types";

// ── Fallback ───────────────────────────────────────────────────
const FALLBACK: HomepageData = {
  nextRace: {
    name: "Japanese Grand Prix",
    nameZh: "日本大奖赛",
    circuit: "Suzuka International Racing Course",
    circuitZh: "铃鹿国际赛车场",
    date: "2026-03-29T06:00:00Z",
    round: 3,
    isSprint: false,
  },
  standings: [
    { pos: 1, id: "russell", name: "George Russell", code: "RUS", pts: 51, color: "#27F4D2" },
    { pos: 2, id: "antonelli", name: "Kimi Antonelli", code: "ANT", pts: 37, color: "#27F4D2" },
    { pos: 3, id: "leclerc", name: "Charles Leclerc", code: "LEC", pts: 31, color: "#E80020" },
    { pos: 4, id: "norris", name: "Lando Norris", code: "NOR", pts: 28, color: "#FF8000" },
    { pos: 5, id: "verstappen", name: "Max Verstappen", code: "VER", pts: 25, color: "#3671C6" },
  ],
  recent: [
    { round: 1, slug: "australian-gp", name: "Australian GP", code: "RUS", color: "#27F4D2" },
    { round: 2, slug: "chinese-gp", name: "Chinese GP", code: "ANT", color: "#27F4D2" },
  ],
  maxPts: 51,
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [races, drivers] = await Promise.all([getRacesList(), getDriversList()]);

    // Find next upcoming race
    const nextRace = races.find((r) => r.next) || races.find((r) => !r.completed);
    // Find completed races (most recent first) for "recent results"
    const completedRaces = races.filter((r) => r.completed).reverse().slice(0, 3);

    // Top 5 drivers for standings widget
    const top5 = drivers.slice(0, 5);
    const maxPts = top5[0]?.pts || 1;

    // If we have meaningful data, use it
    if (top5.length > 0 || nextRace) {
      return {
        nextRace: nextRace
          ? {
              name: nextRace.name,
              nameZh: nextRace.name, // No translation from API
              circuit: nextRace.circuit,
              circuitZh: nextRace.circuit,
              date: nextRace.isoDate || FALLBACK.nextRace.date,
              round: nextRace.round,
              isSprint: !!nextRace.sprint,
            }
          : FALLBACK.nextRace,
        standings:
          top5.length > 0
            ? top5.map((d) => ({
                pos: d.pos,
                id: d.id,
                name: d.name,
                code: d.code,
                pts: d.pts,
                color: d.color,
              }))
            : FALLBACK.standings,
        recent:
          completedRaces.length > 0
            ? completedRaces.map((r) => ({
                round: r.round,
                slug: r.slug,
                name: r.name.replace("Grand Prix", "GP"),
                code: r.code || "",
                color: r.color || "#666",
              }))
            : FALLBACK.recent,
        maxPts,
      };
    }

    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}
