import {
  getConstructorStandings,
  getConstructorSeasonResults,
  getQualifyingResults,
} from "@/lib/api/ergast";
import { getTeamColor } from "./transformers";

// ── Types ────────────────────────────────────────────────────────────────────

interface Driver {
  id: string;
  name: string;
  code: string;
  number: number;
  nationality: string;
  pts: number;
  wins: number;
  podiums: number;
  poles: number;
  dnfs: number;
  qualifyingH2H: number;
  raceH2H: number;
  totalSessions: number;
  totalRaces: number;
}

interface TeamData {
  id: string;
  name: string;
  fullName: string;
  color: string;
  championship: {
    pos: number;
    pts: number;
    wins: number;
    podiums: number;
    poles: number;
    dnfs: number;
  };
  polymarket: {
    probability: number;
    volume: string;
    question: string;
    url: string;
  };
  drivers: [Driver, Driver];
  raceResults: {
    round: number;
    race: string;
    d1: number;
    d2: number;
    teamPts: number;
  }[];
  technical: {
    powerUnit: string;
    chassis: string;
    tyreSupplier: string;
    base: string;
    technicalDirector: string;
    reg2026: string[];
  };
}

export type { TeamData, Driver };

// ── ID alias map (URL slug -> Ergast constructorId) ──────────────────────────

const ID_ALIASES: Record<string, string> = {
  redbull: "red_bull",
  "aston-martin": "aston_martin",
  "racing-bulls": "rb",
  audi: "sauber",
};

function normalizeId(id: string): string {
  return ID_ALIASES[id] ?? id;
}

// ── Static enrichment data ───────────────────────────────────────────────────

interface StaticTeamInfo {
  fullName: string;
  polymarket: {
    probability: number;
    volume: string;
    question: string;
    url: string;
  };
  technical: {
    powerUnit: string;
    chassis: string;
    tyreSupplier: string;
    base: string;
    technicalDirector: string;
    reg2026: string[];
  };
}

const STATIC_TEAM_DATA: Record<string, StaticTeamInfo> = {
  mercedes: {
    fullName: "Mercedes-AMG Petronas F1 Team",
    polymarket: {
      probability: 0.65,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Mercedes-AMG F1 M17 E Performance",
      chassis: "W17",
      tyreSupplier: "Pirelli",
      base: "Brackley, England",
      technicalDirector: "James Allison",
      reg2026: [
        "First season under 2026 ground-effect + active aero regulations",
        "New 1.6L V6 hybrid unit with enhanced MGU-K deployment (350 kW)",
        "Narrower car concept (1,900 mm width) optimised for slower corners",
        "Significantly revised front wing geometry per new aero framework",
      ],
    },
  },

  ferrari: {
    fullName: "Scuderia Ferrari HP",
    polymarket: {
      probability: 0.16,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Ferrari 066/10",
      chassis: "SF-26",
      tyreSupplier: "Pirelli",
      base: "Maranello, Italy",
      technicalDirector: "Loic Serra",
      reg2026: [
        "Heavily revised power unit architecture for 2026 hybrid regulations",
        "New active aero system integrated into SF-26 front and rear wings",
        "Redesigned sidepod concept following 2026 aerodynamic framework",
        "Hamilton joining the team marks a new strategic direction for Scuderia",
      ],
    },
  },

  mclaren: {
    fullName: "McLaren Formula 1 Team",
    polymarket: {
      probability: 0.08,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Mercedes-AMG F1 M17 E Performance",
      chassis: "MCL61",
      tyreSupplier: "Pirelli",
      base: "Woking, England",
      technicalDirector: "Peter Prodromou",
      reg2026: [
        "Customer Mercedes power unit transition to 2026 spec hybrid architecture",
        "Aggressive MCL61 concept with revised sidepod geometry under new regs",
        "Active aero system designed for high-speed stability under 2026 rules",
        "Norris and Piastri retain strong driver lineup from championship-winning 2025",
      ],
    },
  },

  red_bull: {
    fullName: "Oracle Red Bull Racing",
    polymarket: {
      probability: 0.04,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Red Bull Powertrains RBPTH1",
      chassis: "RB22",
      tyreSupplier: "Pirelli",
      base: "Milton Keynes, England",
      technicalDirector: "Pierre Wach\u00e9",
      reg2026: [
        "First Red Bull Powertrains in-house engine makes its competitive debut",
        "RB22 developed under new aerodynamic framework with active aero",
        "Team adapting to new regulations after dominant stretch under old rules",
        "Verstappen leads the team into the new regulatory era",
      ],
    },
  },

  haas: {
    fullName: "MoneyGram Haas F1 Team",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Ferrari 066/10",
      chassis: "VF-26",
      tyreSupplier: "Pirelli",
      base: "Kannapolis, USA",
      technicalDirector: "Andrea De Zordo",
      reg2026: [
        "Customer Ferrari power unit upgraded to 2026 specification",
        "VF-26 marks Haas's most ambitious technical development programme to date",
        "Ocon joins from Alpine to bring experience to the American outfit",
        "Bearman given full season after impressive substitute appearances in 2025",
      ],
    },
  },

  rb: {
    fullName: "Visa Cash App Racing Bulls",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Red Bull Powertrains RBPTH1",
      chassis: "VCARB 02",
      tyreSupplier: "Pirelli",
      base: "Faenza, Italy",
      technicalDirector: "Jody Egginton",
      reg2026: [
        "RBPTH1 power unit shared with Red Bull Racing senior team",
        "VCARB 02 designed to exploit 2026 active aero and narrower car concept",
        "Faenza facility upgraded for 2026 regulation development cycle",
        "Driver lineup positions team as a development pathway for Red Bull talent",
      ],
    },
  },

  alpine: {
    fullName: "BWT Alpine F1 Team",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Mercedes-AMG F1 M17 E Performance",
      chassis: "A526",
      tyreSupplier: "Pirelli",
      base: "Enstone, England",
      technicalDirector: "David Sanchez",
      reg2026: [
        "Switch to customer Mercedes power unit after dropping Renault programme",
        "A526 designed around revised 2026 aerodynamic and dimensional rules",
        "Team consolidating after management restructure in late 2025",
        "Customer engine strategy allows focus on chassis and aero development",
      ],
    },
  },

  sauber: {
    fullName: "Audi F1 Team (formerly Sauber)",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Audi PU",
      chassis: "C45",
      tyreSupplier: "Pirelli",
      base: "Hinwil, Switzerland",
      technicalDirector: "James Key",
      reg2026: [
        "First season as Audi F1 Team after full takeover of Sauber operations",
        "Audi-branded power unit makes its Formula 1 debut in 2026",
        "Significant infrastructure investment at Hinwil facility ahead of 2026",
        "New technical leadership under James Key shapes multi-year development plan",
      ],
    },
  },

  williams: {
    fullName: "Williams Racing",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Mercedes-AMG F1 M17 E Performance",
      chassis: "FW47",
      tyreSupplier: "Pirelli",
      base: "Grove, England",
      technicalDirector: "Pat Fry",
      reg2026: [
        "Customer Mercedes power unit in 2026 specification hybrid form",
        "FW47 designed under James Vowles's ongoing Williams rebuild programme",
        "Sainz recruited from Ferrari to spearhead on-track performance recovery",
        "Continued investment in wind tunnel and simulator infrastructure",
      ],
    },
  },

  cadillac: {
    fullName: "Cadillac F1 Team",
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Cadillac V6 Hybrid",
      chassis: "CGR-01",
      tyreSupplier: "Pirelli",
      base: "Concord, USA",
      technicalDirector: "TBD",
      reg2026: [
        "Cadillac enters Formula 1 as the 11th constructor from the 2026 season",
        "Brand-new power unit developed in partnership with GM's performance division",
        "CGR-01 chassis constructed at new facility in Concord, North Carolina",
        "Drivers and full technical leadership lineup to be confirmed",
      ],
    },
  },

  aston_martin: {
    fullName: "Aston Martin Aramco F1 Team",
    polymarket: {
      probability: 0.02,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    technical: {
      powerUnit: "Honda RBPTH2",
      chassis: "AMR26",
      tyreSupplier: "Pirelli",
      base: "Silverstone, England",
      technicalDirector: "Dan Fallows",
      reg2026: [
        "AMR26 designed from clean sheet for 2026 regulation overhaul",
        "Honda power unit partnership continues into new hybrid era",
        "New factory infrastructure at Silverstone supports 2026 development",
        "Alonso aiming to challenge for podiums in first full season under new regs",
      ],
    },
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true for statuses that indicate the car did NOT finish the race. */
function isDnf(status: string): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  if (s === "finished" || s === "classified") return false;
  // "+N Laps" means the driver finished but lapped — not a DNF
  if (/^\+\d+ lap/i.test(status)) return false;
  // Any numeric position-like status ("1", "2", etc.) is not a DNF
  if (/^\d+$/.test(status.trim())) return false;
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeInt(val: any, fallback = 0): number {
  const n = parseInt(String(val), 10);
  return Number.isNaN(n) ? fallback : n;
}

// ── Main function ────────────────────────────────────────────────────────────

export async function getTeamDetailData(id: string): Promise<TeamData | null> {
  const constructorId = normalizeId(id);
  const staticInfo = STATIC_TEAM_DATA[constructorId];

  try {
    // Fetch all three data sources in parallel
    const [standingsData, resultsData, qualifyingData] = await Promise.all([
      getConstructorStandings(2026),
      getConstructorSeasonResults(2026, constructorId),
      getQualifyingResults(2026),
    ]);

    // ── 1. Extract constructor standing ────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standingsList =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (standingsData as any)?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.ConstructorStandings ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standing = standingsList.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => s.Constructor?.constructorId === constructorId
    );

    if (!standing && !staticInfo) {
      // Completely unknown team
      return null;
    }

    const teamName: string = standing?.Constructor?.name ?? constructorId;
    const teamColor = getTeamColor(teamName);
    const standingPos =
      standing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? standingsList.indexOf(standing) + 1
        : 0;
    const standingPts = safeInt(standing?.points);
    const standingWins = safeInt(standing?.wins);

    // ── 2. Process constructor race results ────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const races: any[] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (resultsData as any)?.MRData?.RaceTable?.Races ?? [];

    // Build per-driver stats accumulators
    // We discover driver IDs from the results themselves
    const driverStats: Record<
      string,
      {
        id: string;
        name: string;
        code: string;
        number: number;
        nationality: string;
        pts: number;
        wins: number;
        podiums: number;
        poles: number;
        dnfs: number;
        // Per-round finishing positions (for H2H)
        racePositions: Record<number, number>;
      }
    > = {};

    const raceResults: TeamData["raceResults"] = [];
    let teamPodiums = 0;
    let teamDnfs = 0;

    for (const race of races) {
      const round = safeInt(race.round);
      const raceName = (race.raceName ?? "")
        .replace(/Grand Prix$/i, "GP")
        .trim();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = race.Results ?? [];

      // Track driver positions for this round (keyed by driverId)
      const roundPositions: Record<string, number> = {};
      const roundPoints: Record<string, number> = {};

      for (const result of results) {
        const driverId: string = result.Driver?.driverId ?? "unknown";
        const pos = safeInt(result.position);
        const pts = parseFloat(result.points ?? "0") || 0;
        const status: string = result.status ?? "";

        // Initialize driver stats if new
        if (!driverStats[driverId]) {
          driverStats[driverId] = {
            id: driverId,
            name: `${result.Driver?.givenName ?? ""} ${result.Driver?.familyName ?? ""}`.trim(),
            code:
              result.Driver?.code ??
              (result.Driver?.familyName ?? "").slice(0, 3).toUpperCase(),
            number: safeInt(result.Driver?.permanentNumber),
            nationality: result.Driver?.nationality ?? "",
            pts: 0,
            wins: 0,
            podiums: 0,
            poles: 0,
            dnfs: 0,
            racePositions: {},
          };
        }

        const ds = driverStats[driverId];
        ds.pts += pts;
        if (pos === 1) ds.wins++;
        if (pos >= 1 && pos <= 3) {
          ds.podiums++;
          teamPodiums++;
        }
        if (isDnf(status)) {
          ds.dnfs++;
          teamDnfs++;
        }

        // Store race position (0 = DNF for display)
        ds.racePositions[round] = isDnf(status) ? 0 : pos;
        roundPositions[driverId] = isDnf(status) ? 0 : pos;
        roundPoints[driverId] = pts;
      }

      // Build race result entry — we expect up to 2 drivers
      const driverIds = Object.keys(roundPositions);
      const d1Id = driverIds[0] ?? "";
      const d2Id = driverIds[1] ?? "";
      const d1Pos = roundPositions[d1Id] ?? 0;
      const d2Pos = roundPositions[d2Id] ?? 0;
      const teamPts =
        (roundPoints[d1Id] ?? 0) + (roundPoints[d2Id] ?? 0);

      raceResults.push({
        round,
        race: raceName,
        d1: d1Pos,
        d2: d2Pos,
        teamPts: Math.round(teamPts),
      });
    }

    // ── 3. Process qualifying data for H2H and poles ───────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qualifyingRaces: any[] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (qualifyingData as any)?.MRData?.RaceTable?.Races ?? [];

    // Map: round -> driverId -> qualifying position
    const qualiPositions: Record<number, Record<string, number>> = {};

    for (const qRace of qualifyingRaces) {
      const round = safeInt(qRace.round);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qualResults: any[] = qRace.QualifyingResults ?? [];

      for (const qr of qualResults) {
        const cId = qr.Constructor?.constructorId;
        if (cId !== constructorId) continue;

        const driverId: string = qr.Driver?.driverId ?? "unknown";
        const pos = safeInt(qr.position);

        if (!qualiPositions[round]) qualiPositions[round] = {};
        qualiPositions[round][driverId] = pos;

        // Count poles
        if (pos === 1 && driverStats[driverId]) {
          driverStats[driverId].poles++;
        }
      }
    }

    // ── 4. Compute H2H stats ───────────────────────────────────────────────
    const driverIds = Object.keys(driverStats);
    const d1Id = driverIds[0] ?? "";
    const d2Id = driverIds[1] ?? "";

    let d1QualH2H = 0;
    let d2QualH2H = 0;
    let totalQualSessions = 0;

    for (const round of Object.keys(qualiPositions)) {
      const rnd = Number(round);
      const posMap = qualiPositions[rnd];
      const p1 = posMap?.[d1Id];
      const p2 = posMap?.[d2Id];
      if (p1 !== undefined && p2 !== undefined && p1 > 0 && p2 > 0) {
        totalQualSessions++;
        if (p1 < p2) d1QualH2H++;
        else if (p2 < p1) d2QualH2H++;
        else {
          // Tie: both get half credit (unlikely in qualifying)
          d1QualH2H++;
          d2QualH2H++;
        }
      }
    }

    let d1RaceH2H = 0;
    let d2RaceH2H = 0;
    let totalRaceH2H = 0;

    for (const race of races) {
      const round = safeInt(race.round);
      const p1 = driverStats[d1Id]?.racePositions[round];
      const p2 = driverStats[d2Id]?.racePositions[round];

      // Both must have started the race
      if (p1 === undefined || p2 === undefined) continue;

      totalRaceH2H++;

      // If one DNF'd (pos=0) and the other finished, finisher wins
      if (p1 === 0 && p2 === 0) continue; // both DNF, no winner
      if (p1 === 0) {
        d2RaceH2H++;
        continue;
      }
      if (p2 === 0) {
        d1RaceH2H++;
        continue;
      }
      if (p1 < p2) d1RaceH2H++;
      else if (p2 < p1) d2RaceH2H++;
    }

    // Use qualifying session count as totalSessions, race count as totalRaces
    const totalSessions = Math.max(totalQualSessions, 1);
    const totalRaces = Math.max(totalRaceH2H, races.length, 1);

    // Count team-level poles
    let teamPoles = 0;
    for (const ds of Object.values(driverStats)) {
      teamPoles += ds.poles;
    }

    // ── 5. Build driver array ──────────────────────────────────────────────
    const driverArray: Driver[] = Object.values(driverStats).map((ds) => ({
      id: ds.id,
      name: ds.name,
      code: ds.code,
      number: ds.number,
      nationality: ds.nationality,
      pts: Math.round(ds.pts),
      wins: ds.wins,
      podiums: ds.podiums,
      poles: ds.poles,
      dnfs: ds.dnfs,
      qualifyingH2H: ds.id === d1Id ? d1QualH2H : d2QualH2H,
      raceH2H: ds.id === d1Id ? d1RaceH2H : d2RaceH2H,
      totalSessions,
      totalRaces,
    }));

    // Sort by points descending
    driverArray.sort((a, b) => b.pts - a.pts);

    // Ensure exactly 2 drivers
    while (driverArray.length < 2) {
      driverArray.push({
        id: "tbd",
        name: "TBD",
        code: "TBD",
        number: 0,
        nationality: "TBD",
        pts: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 0,
        raceH2H: 0,
        totalSessions,
        totalRaces,
      });
    }

    // If the race results used a different ordering for d1/d2 than the sorted
    // driver array, re-map so d1 always corresponds to the higher-points driver
    const sortedD1 = driverArray[0].id;
    const sortedD2 = driverArray[1].id;

    const correctedRaceResults = raceResults.map((rr) => {
      // Original d1/d2 positions were based on discovery order (driverIds[0]/[1])
      // We need to swap if the sorted order differs
      if (sortedD1 === d1Id) {
        return rr; // same order
      }
      // Swap d1 and d2
      return { ...rr, d1: rr.d2, d2: rr.d1 };
    });

    // ── 6. Assemble TeamData ───────────────────────────────────────────────
    const teamData: TeamData = {
      id: constructorId,
      name: teamName,
      fullName: staticInfo?.fullName ?? teamName,
      color: teamColor,
      championship: {
        pos: standingPos || 0,
        pts: standingPts,
        wins: standingWins,
        podiums: teamPodiums,
        poles: teamPoles,
        dnfs: teamDnfs,
      },
      polymarket: staticInfo?.polymarket ?? {
        probability: 0,
        volume: "$0",
        question: "Who will win the 2026 Constructors' Championship?",
        url: "https://polymarket.com",
      },
      drivers: [driverArray[0], driverArray[1]],
      raceResults: correctedRaceResults,
      technical: staticInfo?.technical ?? {
        powerUnit: "Unknown",
        chassis: "Unknown",
        tyreSupplier: "Pirelli",
        base: "Unknown",
        technicalDirector: "Unknown",
        reg2026: [],
      },
    };

    return teamData;
  } catch (error) {
    // API failure — fall back to static-only data if available
    if (!staticInfo) return null;

    const fallback: TeamData = {
      id: constructorId,
      name: constructorId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      fullName: staticInfo.fullName,
      color: getTeamColor(staticInfo.fullName),
      championship: { pos: 0, pts: 0, wins: 0, podiums: 0, poles: 0, dnfs: 0 },
      polymarket: staticInfo.polymarket,
      drivers: [
        {
          id: "tbd_1",
          name: "TBD",
          code: "TBD",
          number: 0,
          nationality: "TBD",
          pts: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          dnfs: 0,
          qualifyingH2H: 0,
          raceH2H: 0,
          totalSessions: 0,
          totalRaces: 0,
        },
        {
          id: "tbd_2",
          name: "TBD",
          code: "TBD",
          number: 0,
          nationality: "TBD",
          pts: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          dnfs: 0,
          qualifyingH2H: 0,
          raceH2H: 0,
          totalSessions: 0,
          totalRaces: 0,
        },
      ],
      raceResults: [],
      technical: staticInfo.technical,
    };

    return fallback;
  }
}
