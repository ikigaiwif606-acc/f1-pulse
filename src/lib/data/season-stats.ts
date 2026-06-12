// ── Season statistics computed from Jolpica race + qualifying results ───────
// Replaces the editorial tables that were frozen at round 2: teammate
// head-to-heads, DNF rate by team, and average grid-vs-finish per driver.

import { getSeasonResultsFull, getQualifyingResults } from "@/lib/api/ergast";
import { getTeamColor, getDriverCode } from "./transformers";
import { CURRENT_SEASON } from "./season";

export interface TeammateBattle {
  team: string;
  color: string;
  d1: string;
  c1: string;
  d2: string;
  c2: string;
  qualiH2H: [number, number];
  raceH2H: [number, number];
  pts: [number, number];
}

export interface TeamDnf {
  team: string;
  rate: number; // percent 0-100
  color: string;
}

export interface GridFinish {
  name: string;
  code: string;
  color: string;
  avgGrid: number;
  avgFinish: number;
  delta: number; // positive = gains places on race day
}

export interface SeasonStats {
  battles: TeammateBattle[];
  dnf: TeamDnf[];
  gridFinish: GridFinish[];
  rounds: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Classified finishes: "Finished", "Lapped", or Ergast-style "+N Lap(s)"
const isDnf = (status: string) =>
  status !== "Finished" && status !== "Lapped" && !/^\+\d+ Laps?$/.test(status);

export async function getSeasonStats(): Promise<SeasonStats | null> {
  try {
    const [resultsRes, qualiRes] = await Promise.all([
      getSeasonResultsFull(CURRENT_SEASON) as Promise<any>,
      (getQualifyingResults(CURRENT_SEASON) as Promise<any>).catch(() => null),
    ]);

    const races: any[] = resultsRes?.MRData?.RaceTable?.Races || [];
    if (races.length === 0) return null;
    const qualiRaces: any[] = qualiRes?.MRData?.RaceTable?.Races || [];

    interface DriverAgg {
      name: string;
      lastName: string;
      code: string;
      team: string;
      teamId: string;
      color: string;
      pts: number;
      grids: number[];
      finishes: number[];
      starts: number;
    }
    const drivers = new Map<string, DriverAgg>();
    const teamEntries = new Map<string, { team: string; color: string; starts: number; dnfs: number }>();
    // raceH2H[teamId] / qualiH2H[teamId] → wins keyed by driverId
    const raceWins = new Map<string, Map<string, number>>();
    const qualiWins = new Map<string, Map<string, number>>();

    for (const race of races) {
      const byTeam = new Map<string, any[]>();
      for (const r of race.Results || []) {
        const id = r.Driver?.driverId;
        const teamId = r.Constructor?.constructorId || "";
        const teamName = r.Constructor?.name || "";
        if (!id) continue;

        const d: DriverAgg = drivers.get(id) || {
          name: `${r.Driver?.givenName || ""} ${r.Driver?.familyName || ""}`.trim(),
          lastName: r.Driver?.familyName || "",
          code: r.Driver?.code || getDriverCode(r.Driver?.familyName || ""),
          team: teamName,
          teamId,
          color: getTeamColor(teamName),
          pts: 0,
          grids: [],
          finishes: [],
          starts: 0,
        };
        d.pts += parseFloat(r.points || "0");
        const grid = parseInt(r.grid || "0", 10);
        const pos = parseInt(r.position || "0", 10);
        if (grid > 0 && pos > 0) {
          d.grids.push(grid);
          d.finishes.push(pos);
        }
        d.starts += 1;
        drivers.set(id, d);

        const te = teamEntries.get(teamId) || { team: teamName, color: getTeamColor(teamName), starts: 0, dnfs: 0 };
        te.starts += 1;
        if (isDnf(r.status || "")) te.dnfs += 1;
        teamEntries.set(teamId, te);

        if (!byTeam.has(teamId)) byTeam.set(teamId, []);
        byTeam.get(teamId)!.push(r);
      }

      // Race head-to-head per team (classification order)
      for (const [teamId, rs] of byTeam) {
        if (rs.length !== 2) continue;
        const [a, b] = rs;
        const winner =
          parseInt(a.position || "99", 10) < parseInt(b.position || "99", 10) ? a : b;
        if (!raceWins.has(teamId)) raceWins.set(teamId, new Map());
        const m = raceWins.get(teamId)!;
        const id = winner.Driver?.driverId;
        m.set(id, (m.get(id) || 0) + 1);
      }
    }

    // Qualifying head-to-head per team
    for (const race of qualiRaces) {
      const byTeam = new Map<string, any[]>();
      for (const q of race.QualifyingResults || []) {
        const teamId = q.Constructor?.constructorId || "";
        if (!byTeam.has(teamId)) byTeam.set(teamId, []);
        byTeam.get(teamId)!.push(q);
      }
      for (const [teamId, qs] of byTeam) {
        if (qs.length !== 2) continue;
        const [a, b] = qs;
        const winner =
          parseInt(a.position || "99", 10) < parseInt(b.position || "99", 10) ? a : b;
        if (!qualiWins.has(teamId)) qualiWins.set(teamId, new Map());
        const m = qualiWins.get(teamId)!;
        const id = winner.Driver?.driverId;
        m.set(id, (m.get(id) || 0) + 1);
      }
    }

    // Assemble teammate battles — two drivers per team with the most starts
    const byTeamDrivers = new Map<string, Array<[string, DriverAgg]>>();
    for (const [id, d] of drivers) {
      if (!byTeamDrivers.has(d.teamId)) byTeamDrivers.set(d.teamId, []);
      byTeamDrivers.get(d.teamId)!.push([id, d]);
    }

    const battles: TeammateBattle[] = [];
    for (const [teamId, list] of byTeamDrivers) {
      const pair = list.sort((a, b) => b[1].starts - a[1].starts).slice(0, 2);
      if (pair.length !== 2) continue;
      // Higher points total shown first, matching the original table
      pair.sort((a, b) => b[1].pts - a[1].pts);
      const [[id1, d1], [id2, d2]] = pair;
      battles.push({
        team: d1.team,
        color: d1.color,
        d1: d1.lastName,
        c1: d1.code,
        d2: d2.lastName,
        c2: d2.code,
        qualiH2H: [qualiWins.get(teamId)?.get(id1) || 0, qualiWins.get(teamId)?.get(id2) || 0],
        raceH2H: [raceWins.get(teamId)?.get(id1) || 0, raceWins.get(teamId)?.get(id2) || 0],
        pts: [Math.round(d1.pts), Math.round(d2.pts)],
      });
    }
    battles.sort((a, b) => b.pts[0] + b.pts[1] - (a.pts[0] + a.pts[1]));

    const dnf: TeamDnf[] = [...teamEntries.values()]
      .map((t) => ({
        team: t.team,
        rate: Math.round((t.dnfs / Math.max(t.starts, 1)) * 100),
        color: t.color,
      }))
      .sort((a, b) => b.rate - a.rate);

    const gridFinish: GridFinish[] = [...drivers.values()]
      .filter((d) => d.grids.length >= Math.max(2, races.length - 2))
      .map((d) => {
        const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
        const avgGrid = avg(d.grids);
        const avgFinish = avg(d.finishes);
        return {
          name: d.lastName,
          code: d.code,
          color: d.color,
          avgGrid: Math.round(avgGrid * 10) / 10,
          avgFinish: Math.round(avgFinish * 10) / 10,
          delta: Math.round((avgGrid - avgFinish) * 10) / 10,
        };
      })
      .sort((a, b) => b.delta - a.delta);

    return { battles, dnf, gridFinish, rounds: races.length };
  } catch {
    return null;
  }
}
