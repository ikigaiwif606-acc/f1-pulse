// ── Season context — single source of truth for calendar, next race, status ──
// Jolpica-first (Ergast schema). The static fallback only appears if Jolpica
// itself is unreachable; it must never silently mask live data.

import { getSeasonSchedule, getSeasonWinners } from "@/lib/api/ergast";
import { deriveSlug, getTeamColor, formatDisplayDate } from "./transformers";
import type { RaceListItem } from "@/types";

export const CURRENT_SEASON = 2026;

export type SessionType =
  | "fp1"
  | "fp2"
  | "fp3"
  | "sprintQualifying"
  | "sprint"
  | "qualifying"
  | "race";

export interface SessionTime {
  type: SessionType;
  iso: string;
}

export interface NextRaceInfo {
  slug: string;
  round: number;
  name: string;
  circuit: string; // short key, e.g. "Catalunya" — matches CIRCUIT_FULL_NAME/CIRCUIT_ZH maps
  circuitFull: string;
  country: string;
  flag: string;
  isoDate: string; // race start
  sprint: boolean;
  sessions: SessionTime[];
}

export type SeasonStatus = "live" | "raceWeekend" | "midSeason" | "offSeason";

export interface SeasonContext {
  season: number;
  status: SeasonStatus;
  liveSession: SessionType | null;
  races: RaceListItem[];
  nextRace: NextRaceInfo | null;
  lastCompleted: RaceListItem | null;
  completedCount: number;
  totalRounds: number;
}

// circuitId → { short key used across the app, flag emoji }
const CIRCUIT_META: Record<string, { short: string; flag: string }> = {
  albert_park: { short: "Melbourne", flag: "🇦🇺" },
  shanghai: { short: "Shanghai", flag: "🇨🇳" },
  suzuka: { short: "Suzuka", flag: "🇯🇵" },
  bahrain: { short: "Sakhir", flag: "🇧🇭" },
  jeddah: { short: "Jeddah", flag: "🇸🇦" },
  miami: { short: "Miami", flag: "🇺🇸" },
  villeneuve: { short: "Montreal", flag: "🇨🇦" },
  monaco: { short: "Monte Carlo", flag: "🇲🇨" },
  catalunya: { short: "Catalunya", flag: "🇪🇸" },
  red_bull_ring: { short: "Spielberg", flag: "🇦🇹" },
  silverstone: { short: "Silverstone", flag: "🇬🇧" },
  spa: { short: "Spa-Francorchamps", flag: "🇧🇪" },
  hungaroring: { short: "Hungaroring", flag: "🇭🇺" },
  zandvoort: { short: "Zandvoort", flag: "🇳🇱" },
  monza: { short: "Monza", flag: "🇮🇹" },
  madring: { short: "Madring", flag: "🇪🇸" },
  baku: { short: "Baku", flag: "🇦🇿" },
  marina_bay: { short: "Singapore", flag: "🇸🇬" },
  americas: { short: "Austin", flag: "🇺🇸" },
  rodriguez: { short: "Mexico City", flag: "🇲🇽" },
  interlagos: { short: "Interlagos", flag: "🇧🇷" },
  vegas: { short: "Las Vegas", flag: "🇺🇸" },
  losail: { short: "Lusail", flag: "🇶🇦" },
  yas_marina: { short: "Yas Marina Circuit", flag: "🇦🇪" },
};

// Session windows in minutes — used to decide "live right now"
const SESSION_DURATION: Record<SessionType, number> = {
  fp1: 90,
  fp2: 90,
  fp3: 90,
  sprintQualifying: 75,
  sprint: 90,
  qualifying: 90,
  race: 180,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

function toIso(entry: any): string | null {
  if (!entry?.date) return null;
  return `${entry.date}T${entry.time || "00:00:00Z"}`;
}

function buildSessions(race: any): SessionTime[] {
  const mapping: Array<[SessionType, any]> = [
    ["fp1", race.FirstPractice],
    ["fp2", race.SecondPractice],
    ["fp3", race.ThirdPractice],
    ["sprintQualifying", race.SprintQualifying ?? race.SprintShootout],
    ["sprint", race.Sprint],
    ["qualifying", race.Qualifying],
    ["race", { date: race.date, time: race.time }],
  ];
  return mapping
    .map(([type, entry]) => {
      const iso = toIso(entry);
      return iso ? { type, iso } : null;
    })
    .filter((s): s is SessionTime => s !== null)
    .sort((a, b) => a.iso.localeCompare(b.iso));
}

function raceEndMs(race: any): number {
  const iso = toIso({ date: race.date, time: race.time });
  return iso ? new Date(iso).getTime() + SESSION_DURATION.race * 60_000 : 0;
}

export async function getSeasonContext(): Promise<SeasonContext | null> {
  try {
    const [scheduleRes, winnersRes] = await Promise.all([
      getSeasonSchedule(CURRENT_SEASON) as Promise<any>,
      (getSeasonWinners(CURRENT_SEASON) as Promise<any>).catch(() => null),
    ]);

    const scheduleRaces: any[] = scheduleRes?.MRData?.RaceTable?.Races || [];
    if (scheduleRaces.length === 0) return null;

    const winnerByRound = new Map<number, { name: string; code: string; color: string }>();
    for (const r of winnersRes?.MRData?.RaceTable?.Races || []) {
      const result = r.Results?.[0];
      if (!result) continue;
      winnerByRound.set(parseInt(r.round, 10), {
        name: result.Driver?.familyName || "",
        code: result.Driver?.code || "",
        color: getTeamColor(result.Constructor?.name || ""),
      });
    }

    const now = Date.now();
    const races: RaceListItem[] = scheduleRaces.map((r) => {
      const round = parseInt(r.round, 10);
      const iso = toIso({ date: r.date, time: r.time }) || "";
      const winner = winnerByRound.get(round);
      const completed = !!winner || (iso ? raceEndMs(r) < now : false);
      return {
        slug: deriveSlug(r.raceName),
        round,
        name: r.raceName,
        circuit: CIRCUIT_META[r.Circuit?.circuitId]?.short || r.Circuit?.Location?.locality || "",
        date: iso ? formatDisplayDate(iso) : "",
        isoDate: iso,
        winner: winner?.name,
        code: winner?.code,
        color: winner?.color,
        completed,
        sprint: r.Sprint ? true : undefined,
      };
    });

    const nextIdx = races.findIndex((r) => !r.completed);
    if (nextIdx >= 0) races[nextIdx].next = true;
    const nextScheduleRace = nextIdx >= 0 ? scheduleRaces[nextIdx] : null;

    let nextRace: NextRaceInfo | null = null;
    let status: SeasonStatus = "offSeason";
    let liveSession: SessionType | null = null;

    if (nextScheduleRace && nextIdx >= 0) {
      const sessions = buildSessions(nextScheduleRace);
      const item = races[nextIdx];
      nextRace = {
        slug: item.slug,
        round: item.round,
        name: item.name,
        circuit: item.circuit,
        circuitFull: nextScheduleRace.Circuit?.circuitName || item.circuit,
        country: nextScheduleRace.Circuit?.Location?.country || "",
        flag: CIRCUIT_META[nextScheduleRace.Circuit?.circuitId]?.flag || "🏁",
        isoDate: item.isoDate || "",
        sprint: !!item.sprint,
        sessions,
      };

      const firstSession = sessions[0] ? new Date(sessions[0].iso).getTime() : 0;
      const weekendEnd = raceEndMs(nextScheduleRace);
      for (const s of sessions) {
        const start = new Date(s.iso).getTime();
        if (now >= start && now <= start + SESSION_DURATION[s.type] * 60_000) {
          liveSession = s.type;
        }
      }
      if (liveSession) status = "live";
      else if (firstSession && now >= firstSession - 24 * 3600_000 && now <= weekendEnd) status = "raceWeekend";
      else status = "midSeason";
    } else if (races.length > 0) {
      // All races completed → off-season
      status = "offSeason";
    }
    // Before round 1 weekend: still "offSeason" unless within 24h of FP1 (handled above)
    if (nextIdx === 0 && status === "midSeason") status = "offSeason";

    const completedRaces = races.filter((r) => r.completed);

    return {
      season: CURRENT_SEASON,
      status,
      liveSession,
      races,
      nextRace,
      lastCompleted: completedRaces[completedRaces.length - 1] || null,
      completedCount: completedRaces.length,
      totalRounds: races.length,
    };
  } catch {
    return null;
  }
}
