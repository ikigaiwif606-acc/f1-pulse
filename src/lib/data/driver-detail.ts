import {
  getDriverStandings,
  getDriverSeasonResults,
  getDriverQualifying,
  getConstructorSeasonResults,
} from "@/lib/api/ergast";
import { getTeamColor } from "./transformers";

// ── Types ────────────────────────────────────────────────────────────────────

export type DriverData = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  team: string;
  teamColor: string;
  nationality: string;
  flag: string;
  age: number;
  championshipPos: number;
  stats: {
    points: number;
    wins: number;
    podiums: number;
    poles: number;
    dnfs: number;
    bestFinish: number;
    pointsTarget: number;
  };
  polymarket: {
    championshipPct: number;
    championshipChange: number;
    nextRaceWinPct: number;
    nextRaceWinChange: number;
    volume: string;
    url: string;
  };
  races: {
    round: number;
    name: string;
    circuit: string;
    grid: number;
    finish: number;
    points: number;
    gap: string;
    fl: boolean;
  }[];
  qualifying: {
    avgGapToPole: string;
    sessions: { round: number; name: string; pos: number; gap: string }[];
  };
  h2h: {
    teammate: string;
    teammateCode: string;
    teammateColor: string;
    qualiWins: number;
    qualiLosses: number;
    raceWins: number;
    raceLosses: number;
    points: number;
    teammatePoints: number;
  };
  circuits: {
    name: string;
    flag: string;
    note: string;
    isNext: boolean;
    bestFinish: number;
    avgFinish: number;
    entries: number;
    wins: number;
    podiums: number;
    poles: number;
    safetyCarRate: number;
  }[];
};

// ── Static Enrichment Data ───────────────────────────────────────────────────

const NATIONALITY_FLAGS: Record<string, string> = {
  British: "🇬🇧",
  Italian: "🇮🇹",
  Monégasque: "🇲🇨",
  Dutch: "🇳🇱",
  Spanish: "🇪🇸",
  Finnish: "🇫🇮",
  German: "🇩🇪",
  French: "🇫🇷",
  Australian: "🇦🇺",
  Japanese: "🇯🇵",
  Mexican: "🇲🇽",
  Canadian: "🇨🇦",
  Thai: "🇹🇭",
  Chinese: "🇨🇳",
  "New Zealander": "🇳🇿",
  Brazilian: "🇧🇷",
  Argentine: "🇦🇷",
  Argentinian: "🇦🇷",
  American: "🇺🇸",
  Swedish: "🇸🇪",
  Israeli: "🇮🇱",
};

const CIRCUIT_FLAGS: Record<string, string> = {
  Melbourne: "🇦🇺",
  Shanghai: "🇨🇳",
  Suzuka: "🇯🇵",
  Sakhir: "🇧🇭",
  Jeddah: "🇸🇦",
  Miami: "🇺🇸",
  Montreal: "🇨🇦",
  "Monte Carlo": "🇲🇨",
  Barcelona: "🇪🇸",
  Spielberg: "🇦🇹",
  Silverstone: "🇬🇧",
  "Spa-Francorchamps": "🇧🇪",
  Budapest: "🇭🇺",
  Zandvoort: "🇳🇱",
  Monza: "🇮🇹",
  Madrid: "🇪🇸",
  Baku: "🇦🇿",
  Singapore: "🇸🇬",
  Austin: "🇺🇸",
  "Mexico City": "🇲🇽",
  "São Paulo": "🇧🇷",
  "Las Vegas": "🇺🇸",
  Lusail: "🇶🇦",
  "Yas Island": "🇦🇪",
};

type PolymarketEntry = {
  championshipPct: number;
  championshipChange: number;
  nextRaceWinPct: number;
  nextRaceWinChange: number;
  volume: string;
  url: string;
};

const STATIC_DRIVER_POLYMARKET: Record<string, PolymarketEntry> = {
  russell: {
    championshipPct: 57,
    championshipChange: +8.3,
    nextRaceWinPct: 28,
    nextRaceWinChange: +2.1,
    volume: "$18.2M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  antonelli: {
    championshipPct: 15,
    championshipChange: +3.1,
    nextRaceWinPct: 18,
    nextRaceWinChange: +1.4,
    volume: "$6.4M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  leclerc: {
    championshipPct: 10,
    championshipChange: -1.2,
    nextRaceWinPct: 14,
    nextRaceWinChange: -0.5,
    volume: "$9.1M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  hamilton: {
    championshipPct: 5,
    championshipChange: -2.0,
    nextRaceWinPct: 8,
    nextRaceWinChange: -1.1,
    volume: "$12.3M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  norris: {
    championshipPct: 4,
    championshipChange: -3.5,
    nextRaceWinPct: 10,
    nextRaceWinChange: -0.8,
    volume: "$7.8M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  verstappen: {
    championshipPct: 3,
    championshipChange: -5.0,
    nextRaceWinPct: 6,
    nextRaceWinChange: -2.3,
    volume: "$14.5M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  bearman: {
    championshipPct: 2,
    championshipChange: +1.8,
    nextRaceWinPct: 4,
    nextRaceWinChange: +0.9,
    volume: "$2.1M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  gasly: {
    championshipPct: 1,
    championshipChange: +0.5,
    nextRaceWinPct: 3,
    nextRaceWinChange: +0.3,
    volume: "$1.8M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  lawson: {
    championshipPct: 1,
    championshipChange: +0.4,
    nextRaceWinPct: 2,
    nextRaceWinChange: +0.2,
    volume: "$1.2M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
  piastri: {
    championshipPct: 2,
    championshipChange: -1.8,
    nextRaceWinPct: 5,
    nextRaceWinChange: -0.6,
    volume: "$4.3M",
    url: "https://polymarket.com/event/f1-2026-wdc",
  },
};

const DEFAULT_POLYMARKET: PolymarketEntry = {
  championshipPct: 0,
  championshipChange: 0,
  nextRaceWinPct: 0,
  nextRaceWinChange: 0,
  volume: "N/A",
  url: "https://polymarket.com",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Compute age from an ISO date-of-birth string (e.g. "1998-02-15"). */
function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/** Parse a lap-time string like "1:18.518" into total seconds. Returns NaN on failure. */
function parseTimeToSeconds(timeStr: string | undefined | null): number {
  if (!timeStr) return NaN;
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    return mins * 60 + secs;
  }
  // Might be seconds-only, e.g. "18.518"
  return parseFloat(timeStr);
}

/** Check if a race status indicates a DNF (not "Finished" and not lapped). */
function isDnf(status: string): boolean {
  if (status === "Finished") return false;
  if (/^\+\d+ Lap/.test(status)) return false;
  return true;
}

/** Resolve the circuit locality to a flag emoji. */
function getCircuitFlag(locality: string): string {
  for (const [key, flag] of Object.entries(CIRCUIT_FLAGS)) {
    if (locality.toLowerCase().includes(key.toLowerCase())) return flag;
  }
  return "🏁";
}

/** Abbreviate a Grand Prix name for qualifying sessions, e.g. "Australian Grand Prix" -> "AUS". */
function abbreviateRaceName(raceName: string): string {
  return raceName
    .replace(/Grand Prix$/i, "")
    .trim()
    .slice(0, 3)
    .toUpperCase();
}

// ── Main Function ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErgastAny = any;

export async function getDriverDetailData(id: string): Promise<DriverData | null> {
  try {
    // 1. Fetch standings, race results, and qualifying in parallel
    const [standingsRaw, resultsRaw, qualifyingRaw] = await Promise.all([
      getDriverStandings(2026).catch(() => null),
      getDriverSeasonResults(2026, id).catch(() => null),
      getDriverQualifying(2026, id).catch(() => null),
    ]);

    // ── Parse standings ────────────────────────────────────────────
    const standingsList: ErgastAny[] =
      (standingsRaw as ErgastAny)?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.DriverStandings ?? [];

    const driverStanding = standingsList.find(
      (s: ErgastAny) => s.Driver?.driverId === id
    );

    if (!driverStanding) return null;

    const driverInfo = driverStanding.Driver;
    const constructorInfo = driverStanding.Constructors?.[0];
    const constructorId: string = constructorInfo?.constructorId ?? "";
    const teamName: string = constructorInfo?.name ?? "";
    const teamColor = getTeamColor(teamName);

    const firstName: string = driverInfo.givenName ?? "";
    const lastName: string = driverInfo.familyName ?? "";
    const nationality: string = driverInfo.nationality ?? "";
    const flag = NATIONALITY_FLAGS[nationality] ?? "🏳️";
    const age = driverInfo.dateOfBirth ? computeAge(driverInfo.dateOfBirth) : 0;
    const code: string = driverInfo.code ?? lastName.slice(0, 3).toUpperCase();
    const driverNumber = parseInt(driverInfo.permanentNumber || "0", 10);

    const championshipPos =
      standingsList.findIndex((s: ErgastAny) => s.Driver?.driverId === id) + 1;
    const standingPoints = parseInt(driverStanding.points || "0", 10);
    const standingWins = parseInt(driverStanding.wins || "0", 10);

    // ── Parse race results ──────────────────────────────────────────
    const raceResults: ErgastAny[] =
      (resultsRaw as ErgastAny)?.MRData?.RaceTable?.Races ?? [];

    const races: DriverData["races"] = [];
    let podiums = 0;
    let dnfs = 0;
    let bestFinish = Infinity;
    const finishPositions: number[] = [];

    for (const race of raceResults) {
      const result = race.Results?.[0];
      if (!result) continue;

      const finish = parseInt(result.position || "0", 10);
      const grid = parseInt(result.grid || "0", 10);
      const pts = parseFloat(result.points || "0");
      const status: string = result.status || "";
      const hasFastestLap = result.FastestLap?.rank === "1";

      let gap = "N/A";
      if (finish === 1) {
        gap = "WINNER";
      } else if (result.Time?.time) {
        gap = `+${result.Time.time}`;
      } else if (status && isDnf(status)) {
        gap = status;
      } else if (status) {
        gap = status;
      }

      if (finish >= 1 && finish <= 3) podiums++;
      if (isDnf(status)) dnfs++;
      if (finish > 0 && finish < bestFinish) bestFinish = finish;
      if (finish > 0) finishPositions.push(finish);

      races.push({
        round: parseInt(race.round || "0", 10),
        name: (race.raceName || "").replace(/ Grand Prix$/i, " GP"),
        circuit: race.Circuit?.Location?.locality || race.Circuit?.circuitName || "",
        grid,
        finish,
        points: pts,
        gap,
        fl: hasFastestLap,
      });
    }

    if (bestFinish === Infinity) bestFinish = 0;

    const racesCompleted = races.length;
    const pointsTarget =
      racesCompleted > 0 ? Math.ceil(standingPoints * (24 / racesCompleted)) : 0;

    // ── Parse qualifying ────────────────────────────────────────────
    const qualifyingRaces: ErgastAny[] =
      (qualifyingRaw as ErgastAny)?.MRData?.RaceTable?.Races ?? [];

    const qualSessions: DriverData["qualifying"]["sessions"] = [];
    const gapsToPole: number[] = [];
    let polesCount = 0;

    for (const race of qualifyingRaces) {
      const allQResults: ErgastAny[] = race.QualifyingResults ?? [];

      // Find this driver's qualifying result
      const driverQResult = allQResults.find(
        (qr: ErgastAny) => qr.Driver?.driverId === id
      );
      if (!driverQResult) continue;

      const pos = parseInt(driverQResult.position || "0", 10);
      if (pos === 1) polesCount++;

      // Find pole-sitter's time (position === "1")
      const poleSitter = allQResults.find(
        (qr: ErgastAny) => qr.position === "1"
      );

      // Get best qualifying time for both pole sitter and this driver
      const poleTime = parseTimeToSeconds(
        poleSitter?.Q3 || poleSitter?.Q2 || poleSitter?.Q1
      );
      const driverTime = parseTimeToSeconds(
        driverQResult.Q3 || driverQResult.Q2 || driverQResult.Q1
      );

      let gapStr = "N/A";
      if (!isNaN(poleTime) && !isNaN(driverTime)) {
        const gapSec = driverTime - poleTime;
        gapsToPole.push(gapSec);
        gapStr = gapSec <= 0 ? "+0.000" : `+${gapSec.toFixed(3)}`;
      }

      qualSessions.push({
        round: parseInt(race.round || "0", 10),
        name: abbreviateRaceName(race.raceName || ""),
        pos,
        gap: gapStr,
      });
    }

    const avgGapToPole =
      gapsToPole.length > 0
        ? `+${(gapsToPole.reduce((a, b) => a + b, 0) / gapsToPole.length).toFixed(3)}s`
        : "N/A";

    // ── Head-to-head vs teammate ────────────────────────────────────
    const h2h = await computeHeadToHead(
      id,
      constructorId,
      standingsList,
      qualifyingRaces
    );

    // ── Circuits (from current season only) ─────────────────────────
    const circuits = buildCircuitData(raceResults, qualifyingRaces, id);

    // ── Polymarket enrichment ───────────────────────────────────────
    const polymarket = STATIC_DRIVER_POLYMARKET[id] ?? DEFAULT_POLYMARKET;

    // ── Assemble final object ───────────────────────────────────────
    return {
      id,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      code,
      number: driverNumber,
      team: teamName,
      teamColor,
      nationality,
      flag,
      age,
      championshipPos,
      stats: {
        points: standingPoints,
        wins: standingWins,
        podiums,
        poles: polesCount,
        dnfs,
        bestFinish,
        pointsTarget,
      },
      polymarket,
      races,
      qualifying: {
        avgGapToPole,
        sessions: qualSessions,
      },
      h2h,
      circuits,
    };
  } catch {
    return null;
  }
}

// ── Head-to-Head Computation ─────────────────────────────────────────────────

async function computeHeadToHead(
  driverId: string,
  constructorId: string,
  standingsList: ErgastAny[],
  qualifyingRaces: ErgastAny[]
): Promise<DriverData["h2h"]> {
  const defaultH2h: DriverData["h2h"] = {
    teammate: "N/A",
    teammateCode: "N/A",
    teammateColor: "#666",
    qualiWins: 0,
    qualiLosses: 0,
    raceWins: 0,
    raceLosses: 0,
    points: 0,
    teammatePoints: 0,
  };

  if (!constructorId) return defaultH2h;

  // Find the teammate from standings (same constructor, different driver)
  const teammateStanding = standingsList.find(
    (s: ErgastAny) =>
      s.Constructors?.[0]?.constructorId === constructorId &&
      s.Driver?.driverId !== driverId
  );

  if (!teammateStanding) return defaultH2h;

  const teammateId: string = teammateStanding.Driver.driverId;
  const teammateName = `${teammateStanding.Driver.givenName} ${teammateStanding.Driver.familyName}`;
  const teammateCode: string =
    teammateStanding.Driver.code ??
    teammateStanding.Driver.familyName.slice(0, 3).toUpperCase();
  const teammateColor = getTeamColor(
    teammateStanding.Constructors?.[0]?.name ?? ""
  );
  const driverPoints = parseInt(
    standingsList.find((s: ErgastAny) => s.Driver?.driverId === driverId)
      ?.points || "0",
    10
  );
  const teammatePoints = parseInt(teammateStanding.points || "0", 10);

  // Fetch constructor results to compare round-by-round
  let constructorRaces: ErgastAny[] = [];
  try {
    const constructorResults = await getConstructorSeasonResults(
      2026,
      constructorId
    );
    constructorRaces =
      (constructorResults as ErgastAny)?.MRData?.RaceTable?.Races ?? [];
  } catch {
    // If constructor results fail, we can still provide partial data
  }

  let qualiWins = 0;
  let qualiLosses = 0;
  let raceWins = 0;
  let raceLosses = 0;

  // Race head-to-head from constructor results
  for (const race of constructorRaces) {
    const results: ErgastAny[] = race.Results ?? [];
    const driverResult = results.find(
      (r: ErgastAny) => r.Driver?.driverId === driverId
    );
    const teammateResult = results.find(
      (r: ErgastAny) => r.Driver?.driverId === teammateId
    );

    if (driverResult && teammateResult) {
      const driverPos = parseInt(driverResult.position || "99", 10);
      const teammatePos = parseInt(teammateResult.position || "99", 10);
      if (driverPos < teammatePos) raceWins++;
      else if (teammatePos < driverPos) raceLosses++;
    }
  }

  // Qualifying head-to-head from qualifying data
  for (const race of qualifyingRaces) {
    const allQResults: ErgastAny[] = race.QualifyingResults ?? [];
    const driverQ = allQResults.find(
      (qr: ErgastAny) => qr.Driver?.driverId === driverId
    );
    const teammateQ = allQResults.find(
      (qr: ErgastAny) => qr.Driver?.driverId === teammateId
    );

    if (driverQ && teammateQ) {
      const driverPos = parseInt(driverQ.position || "99", 10);
      const teammatePos = parseInt(teammateQ.position || "99", 10);
      if (driverPos < teammatePos) qualiWins++;
      else if (teammatePos < driverPos) qualiLosses++;
    }
  }

  return {
    teammate: teammateName,
    teammateCode,
    teammateColor,
    qualiWins,
    qualiLosses,
    raceWins,
    raceLosses,
    points: driverPoints,
    teammatePoints,
  };
}

// ── Circuit Data Builder ─────────────────────────────────────────────────────

function buildCircuitData(
  raceResults: ErgastAny[],
  qualifyingRaces: ErgastAny[],
  driverId: string
): DriverData["circuits"] {
  const circuits: DriverData["circuits"] = [];

  // Build a set of rounds that have results (completed races)
  const completedRounds = new Set(
    raceResults.map((r: ErgastAny) => parseInt(r.round || "0", 10))
  );

  // Qualifying rounds that don't have race results are likely the next race
  const qualOnlyRounds = qualifyingRaces.filter(
    (qr: ErgastAny) => !completedRounds.has(parseInt(qr.round || "0", 10))
  );

  // Add completed race circuits
  for (const race of raceResults) {
    const result = race.Results?.[0];
    if (!result) continue;

    const locality: string =
      race.Circuit?.Location?.locality || race.Circuit?.circuitName || "Unknown";
    const finish = parseInt(result.position || "0", 10);
    const grid = parseInt(result.grid || "0", 10);
    const round = parseInt(race.round || "0", 10);
    const status: string = result.status || "";

    // For qualifying pole at this circuit
    const matchingQual = qualifyingRaces.find(
      (qr: ErgastAny) => parseInt(qr.round || "0", 10) === round
    );
    const driverQualResult = matchingQual?.QualifyingResults?.find(
      (qr: ErgastAny) => qr.Driver?.driverId === driverId
    );
    const qualPos = driverQualResult
      ? parseInt(driverQualResult.position || "0", 10)
      : 0;

    const isWin = finish === 1;
    const isPodium = finish >= 1 && finish <= 3;
    const isPole = qualPos === 1;

    const finishNote = isWin
      ? `R${round} — 2026 Winner`
      : isDnf(status)
        ? `R${round} — DNF (${status})`
        : `R${round} — P${finish}`;

    circuits.push({
      name: locality,
      flag: getCircuitFlag(locality),
      note: finishNote,
      isNext: false,
      bestFinish: finish > 0 ? finish : 0,
      avgFinish: finish > 0 ? finish : 0,
      entries: 1,
      wins: isWin ? 1 : 0,
      podiums: isPodium ? 1 : 0,
      poles: isPole ? 1 : 0,
      safetyCarRate: 0, // Not available from current-season-only data
    });
  }

  // Add next upcoming circuit if we have qualifying but no race result
  if (qualOnlyRounds.length > 0) {
    const nextQual = qualOnlyRounds[0];
    const locality: string =
      nextQual.Circuit?.Location?.locality ||
      nextQual.Circuit?.circuitName ||
      "Unknown";
    const round = parseInt(nextQual.round || "0", 10);

    circuits.unshift({
      name: locality,
      flag: getCircuitFlag(locality),
      note: `Next Race — R${round}`,
      isNext: true,
      bestFinish: 0,
      avgFinish: 0,
      entries: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      safetyCarRate: 0,
    });
  }

  return circuits;
}
