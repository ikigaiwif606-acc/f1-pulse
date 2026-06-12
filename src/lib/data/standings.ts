// ── Standings page data — points progression across rounds ─────────────────
import { getSeasonResultsFull } from "@/lib/api/ergast";
import { getTeamColor } from "./transformers";
import { CURRENT_SEASON } from "./season";

export interface ProgressionSeries {
  code: string;
  name: string;
  color: string;
}

// One row per round: { round: 1, RUS: 25, ANT: 18, ... }
export type ProgressionPoint = { round: number; race: string } & Record<string, number | string>;

export interface PointsProgression {
  series: ProgressionSeries[];
  points: ProgressionPoint[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Cumulative race points per driver per round for the top `topN` drivers.
 * Note: sprint points are not included (Jolpica exposes them separately);
 * the chart shows race-points progression, the tables show official totals.
 */
export async function getPointsProgression(topN = 6): Promise<PointsProgression | null> {
  try {
    const res: any = await getSeasonResultsFull(CURRENT_SEASON);
    const races: any[] = res?.MRData?.RaceTable?.Races || [];
    if (races.length === 0) return null;

    const totals = new Map<string, { name: string; color: string; pts: number }>();
    const perRound: Array<{ round: number; race: string; pts: Map<string, number> }> = [];

    for (const race of races) {
      const roundPts = new Map<string, number>();
      for (const result of race.Results || []) {
        const code = result.Driver?.code || result.Driver?.familyName?.slice(0, 3).toUpperCase();
        if (!code) continue;
        const pts = parseFloat(result.points || "0");
        roundPts.set(code, pts);
        const entry = totals.get(code) || {
          name: `${result.Driver?.givenName || ""} ${result.Driver?.familyName || ""}`.trim(),
          color: getTeamColor(result.Constructor?.name || ""),
          pts: 0,
        };
        entry.pts += pts;
        totals.set(code, entry);
      }
      perRound.push({
        round: parseInt(race.round, 10),
        race: (race.raceName || "").replace(" Grand Prix", ""),
        pts: roundPts,
      });
    }

    const top = [...totals.entries()]
      .sort((a, b) => b[1].pts - a[1].pts)
      .slice(0, topN);

    const series: ProgressionSeries[] = top.map(([code, v]) => ({ code, name: v.name, color: v.color }));

    const running = new Map<string, number>(top.map(([code]) => [code, 0]));
    const points: ProgressionPoint[] = perRound.map((r) => {
      const row: ProgressionPoint = { round: r.round, race: r.race };
      for (const [code] of top) {
        running.set(code, (running.get(code) || 0) + (r.pts.get(code) || 0));
        row[code] = running.get(code) || 0;
      }
      return row;
    });

    return { series, points };
  } catch {
    return null;
  }
}
