import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// ── Data ──────────────────────────────────────────────────────────────────────

type DriverData = {
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

const DRIVERS_DATA: Record<string, DriverData> = {
  russell: {
    id: "russell",
    name: "George Russell",
    firstName: "George",
    lastName: "Russell",
    code: "RUS",
    number: 63,
    team: "Mercedes",
    teamColor: "#27F4D2",
    nationality: "British",
    flag: "🇬🇧",
    age: 28,
    championshipPos: 1,
    stats: {
      points: 51,
      wins: 2,
      podiums: 2,
      poles: 2,
      dnfs: 0,
      bestFinish: 1,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 57,
      championshipChange: +8.3,
      nextRaceWinPct: 28,
      nextRaceWinChange: +2.1,
      volume: "$18.2M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 1, finish: 1, points: 25, gap: "WINNER", fl: true },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 2, finish: 2, points: 18, gap: "+12.341s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.000s",
      sessions: [
        { round: 1, name: "AUS", pos: 1, gap: "+0.000" },
        { round: 2, name: "CHN", pos: 1, gap: "+0.000" },
      ],
    },
    h2h: {
      teammate: "Kimi Antonelli",
      teammateCode: "ANT",
      teammateColor: "#27F4D2",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 51,
      teammatePoints: 37,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 3,
        avgFinish: 4.8,
        entries: 4,
        wins: 0,
        podiums: 1,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — 2026 Winner",
        isNext: false,
        bestFinish: 1,
        avgFinish: 3.2,
        entries: 5,
        wins: 1,
        podiums: 3,
        poles: 2,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P2",
        isNext: false,
        bestFinish: 2,
        avgFinish: 5.0,
        entries: 3,
        wins: 0,
        podiums: 1,
        poles: 1,
        safetyCarRate: 25,
      },
    ],
  },

  antonelli: {
    id: "antonelli",
    name: "Kimi Antonelli",
    firstName: "Kimi",
    lastName: "Antonelli",
    code: "ANT",
    number: 12,
    team: "Mercedes",
    teamColor: "#27F4D2",
    nationality: "Italian",
    flag: "🇮🇹",
    age: 19,
    championshipPos: 2,
    stats: {
      points: 37,
      wins: 1,
      podiums: 2,
      poles: 0,
      dnfs: 0,
      bestFinish: 1,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 15,
      championshipChange: +3.1,
      nextRaceWinPct: 18,
      nextRaceWinChange: +1.4,
      volume: "$6.4M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 3, finish: 3, points: 15, gap: "+18.204s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 1, finish: 1, points: 25, gap: "WINNER", fl: true },
    ],
    qualifying: {
      avgGapToPole: "+0.081s",
      sessions: [
        { round: 1, name: "AUS", pos: 3, gap: "+0.162" },
        { round: 2, name: "CHN", pos: 1, gap: "+0.000" },
      ],
    },
    h2h: {
      teammate: "George Russell",
      teammateCode: "RUS",
      teammateColor: "#27F4D2",
      qualiWins: 0,
      qualiLosses: 2,
      raceWins: 0,
      raceLosses: 2,
      points: 37,
      teammatePoints: 51,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 4,
        avgFinish: 4.0,
        entries: 1,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P3",
        isNext: false,
        bestFinish: 3,
        avgFinish: 3.0,
        entries: 1,
        wins: 0,
        podiums: 1,
        poles: 0,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — 2026 Winner",
        isNext: false,
        bestFinish: 1,
        avgFinish: 1.0,
        entries: 1,
        wins: 1,
        podiums: 1,
        poles: 1,
        safetyCarRate: 25,
      },
    ],
  },

  leclerc: {
    id: "leclerc",
    name: "Charles Leclerc",
    firstName: "Charles",
    lastName: "Leclerc",
    code: "LEC",
    number: 16,
    team: "Ferrari",
    teamColor: "#E80020",
    nationality: "Monégasque",
    flag: "🇲🇨",
    age: 28,
    championshipPos: 3,
    stats: {
      points: 31,
      wins: 0,
      podiums: 2,
      poles: 0,
      dnfs: 0,
      bestFinish: 2,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 10,
      championshipChange: -1.2,
      nextRaceWinPct: 12,
      nextRaceWinChange: -0.8,
      volume: "$4.1M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 4, finish: 2, points: 18, gap: "+8.812s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 5, finish: 3, points: 15, gap: "+22.576s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.243s",
      sessions: [
        { round: 1, name: "AUS", pos: 4, gap: "+0.312" },
        { round: 2, name: "CHN", pos: 5, gap: "+0.174" },
      ],
    },
    h2h: {
      teammate: "Lewis Hamilton",
      teammateCode: "HAM",
      teammateColor: "#E80020",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 31,
      teammatePoints: 22,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 2,
        avgFinish: 4.5,
        entries: 6,
        wins: 0,
        podiums: 2,
        poles: 1,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P2",
        isNext: false,
        bestFinish: 1,
        avgFinish: 4.1,
        entries: 7,
        wins: 2,
        podiums: 4,
        poles: 3,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P3",
        isNext: false,
        bestFinish: 2,
        avgFinish: 5.2,
        entries: 5,
        wins: 0,
        podiums: 2,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },

  norris: {
    id: "norris",
    name: "Lando Norris",
    firstName: "Lando",
    lastName: "Norris",
    code: "NOR",
    number: 4,
    team: "McLaren",
    teamColor: "#FF8000",
    nationality: "British",
    flag: "🇬🇧",
    age: 25,
    championshipPos: 4,
    stats: {
      points: 28,
      wins: 0,
      podiums: 1,
      poles: 0,
      dnfs: 0,
      bestFinish: 3,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 8,
      championshipChange: -2.4,
      nextRaceWinPct: 10,
      nextRaceWinChange: -1.0,
      volume: "$3.2M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 5, finish: 4, points: 12, gap: "+31.005s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 4, finish: 3, points: 15, gap: "WINNER", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.298s",
      sessions: [
        { round: 1, name: "AUS", pos: 5, gap: "+0.421" },
        { round: 2, name: "CHN", pos: 4, gap: "+0.175" },
      ],
    },
    h2h: {
      teammate: "Oscar Piastri",
      teammateCode: "PIA",
      teammateColor: "#FF8000",
      qualiWins: 1,
      qualiLosses: 1,
      raceWins: 1,
      raceLosses: 1,
      points: 28,
      teammatePoints: 20,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 3,
        avgFinish: 5.5,
        entries: 5,
        wins: 0,
        podiums: 1,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P4",
        isNext: false,
        bestFinish: 2,
        avgFinish: 5.0,
        entries: 5,
        wins: 0,
        podiums: 2,
        poles: 1,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P3",
        isNext: false,
        bestFinish: 1,
        avgFinish: 4.6,
        entries: 4,
        wins: 1,
        podiums: 2,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },

  verstappen: {
    id: "verstappen",
    name: "Max Verstappen",
    firstName: "Max",
    lastName: "Verstappen",
    code: "VER",
    number: 1,
    team: "Red Bull",
    teamColor: "#3671C6",
    nationality: "Dutch",
    flag: "🇳🇱",
    age: 27,
    championshipPos: 5,
    stats: {
      points: 25,
      wins: 0,
      podiums: 1,
      poles: 0,
      dnfs: 0,
      bestFinish: 2,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 5,
      championshipChange: -6.1,
      nextRaceWinPct: 8,
      nextRaceWinChange: -2.3,
      volume: "$2.8M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 2, finish: 5, points: 10, gap: "+38.441s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 3, finish: 2, points: 18, gap: "+5.821s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.189s",
      sessions: [
        { round: 1, name: "AUS", pos: 2, gap: "+0.088" },
        { round: 2, name: "CHN", pos: 3, gap: "+0.290" },
      ],
    },
    h2h: {
      teammate: "Yuki Tsunoda",
      teammateCode: "TSU",
      teammateColor: "#3671C6",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 25,
      teammatePoints: 8,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 1,
        avgFinish: 2.3,
        entries: 7,
        wins: 4,
        podiums: 6,
        poles: 3,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P5",
        isNext: false,
        bestFinish: 1,
        avgFinish: 3.1,
        entries: 8,
        wins: 2,
        podiums: 5,
        poles: 2,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P2",
        isNext: false,
        bestFinish: 1,
        avgFinish: 2.8,
        entries: 6,
        wins: 3,
        podiums: 5,
        poles: 2,
        safetyCarRate: 25,
      },
    ],
  },

  hamilton: {
    id: "hamilton",
    name: "Lewis Hamilton",
    firstName: "Lewis",
    lastName: "Hamilton",
    code: "HAM",
    number: 44,
    team: "Ferrari",
    teamColor: "#E80020",
    nationality: "British",
    flag: "🇬🇧",
    age: 41,
    championshipPos: 6,
    stats: {
      points: 22,
      wins: 0,
      podiums: 1,
      poles: 0,
      dnfs: 0,
      bestFinish: 3,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 3,
      championshipChange: -0.5,
      nextRaceWinPct: 5,
      nextRaceWinChange: +0.2,
      volume: "$1.9M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 6, finish: 3, points: 15, gap: "+14.992s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 8, finish: 6, points: 8, gap: "+44.331s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.387s",
      sessions: [
        { round: 1, name: "AUS", pos: 6, gap: "+0.489" },
        { round: 2, name: "CHN", pos: 8, gap: "+0.285" },
      ],
    },
    h2h: {
      teammate: "Charles Leclerc",
      teammateCode: "LEC",
      teammateColor: "#E80020",
      qualiWins: 0,
      qualiLosses: 2,
      raceWins: 0,
      raceLosses: 2,
      points: 22,
      teammatePoints: 31,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 1,
        avgFinish: 3.8,
        entries: 18,
        wins: 3,
        podiums: 9,
        poles: 5,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P3",
        isNext: false,
        bestFinish: 1,
        avgFinish: 3.5,
        entries: 19,
        wins: 4,
        podiums: 10,
        poles: 6,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P6",
        isNext: false,
        bestFinish: 1,
        avgFinish: 4.2,
        entries: 16,
        wins: 6,
        podiums: 10,
        poles: 5,
        safetyCarRate: 25,
      },
    ],
  },

  piastri: {
    id: "piastri",
    name: "Oscar Piastri",
    firstName: "Oscar",
    lastName: "Piastri",
    code: "PIA",
    number: 81,
    team: "McLaren",
    teamColor: "#FF8000",
    nationality: "Australian",
    flag: "🇦🇺",
    age: 24,
    championshipPos: 7,
    stats: {
      points: 20,
      wins: 0,
      podiums: 0,
      poles: 0,
      dnfs: 0,
      bestFinish: 4,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 1,
      championshipChange: -0.8,
      nextRaceWinPct: 6,
      nextRaceWinChange: +0.4,
      volume: "$0.9M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 7, finish: 4, points: 12, gap: "+29.113s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 6, finish: 5, points: 10, gap: "+36.780s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.343s",
      sessions: [
        { round: 1, name: "AUS", pos: 7, gap: "+0.511" },
        { round: 2, name: "CHN", pos: 6, gap: "+0.175" },
      ],
    },
    h2h: {
      teammate: "Lando Norris",
      teammateCode: "NOR",
      teammateColor: "#FF8000",
      qualiWins: 1,
      qualiLosses: 1,
      raceWins: 1,
      raceLosses: 1,
      points: 20,
      teammatePoints: 28,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 4,
        avgFinish: 5.5,
        entries: 2,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P4",
        isNext: false,
        bestFinish: 3,
        avgFinish: 4.5,
        entries: 2,
        wins: 0,
        podiums: 1,
        poles: 0,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P5",
        isNext: false,
        bestFinish: 4,
        avgFinish: 5.0,
        entries: 2,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },

  hulkenberg: {
    id: "hulkenberg",
    name: "Nico Hulkenberg",
    firstName: "Nico",
    lastName: "Hulkenberg",
    code: "HUL",
    number: 27,
    team: "Audi",
    teamColor: "#00594F",
    nationality: "German",
    flag: "🇩🇪",
    age: 37,
    championshipPos: 8,
    stats: {
      points: 12,
      wins: 0,
      podiums: 0,
      poles: 0,
      dnfs: 0,
      bestFinish: 6,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 0.5,
      championshipChange: +0.1,
      nextRaceWinPct: 2,
      nextRaceWinChange: +0.1,
      volume: "$0.4M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 9, finish: 7, points: 6, gap: "+52.334s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 10, finish: 6, points: 8, gap: "+41.229s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.621s",
      sessions: [
        { round: 1, name: "AUS", pos: 9, gap: "+0.734" },
        { round: 2, name: "CHN", pos: 10, gap: "+0.508" },
      ],
    },
    h2h: {
      teammate: "Gabriel Bortoleto",
      teammateCode: "BOR",
      teammateColor: "#00594F",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 12,
      teammatePoints: 4,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 6,
        avgFinish: 8.2,
        entries: 9,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P7",
        isNext: false,
        bestFinish: 5,
        avgFinish: 9.1,
        entries: 10,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P6",
        isNext: false,
        bestFinish: 6,
        avgFinish: 8.5,
        entries: 7,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },

  alonso: {
    id: "alonso",
    name: "Fernando Alonso",
    firstName: "Fernando",
    lastName: "Alonso",
    code: "ALO",
    number: 14,
    team: "Aston Martin",
    teamColor: "#229971",
    nationality: "Spanish",
    flag: "🇪🇸",
    age: 44,
    championshipPos: 9,
    stats: {
      points: 10,
      wins: 0,
      podiums: 0,
      poles: 0,
      dnfs: 0,
      bestFinish: 7,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 0.3,
      championshipChange: -0.1,
      nextRaceWinPct: 1,
      nextRaceWinChange: -0.1,
      volume: "$0.3M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 11, finish: 8, points: 4, gap: "+61.112s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 9, finish: 7, points: 6, gap: "+55.004s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.714s",
      sessions: [
        { round: 1, name: "AUS", pos: 11, gap: "+0.881" },
        { round: 2, name: "CHN", pos: 9, gap: "+0.547" },
      ],
    },
    h2h: {
      teammate: "Lance Stroll",
      teammateCode: "STR",
      teammateColor: "#229971",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 10,
      teammatePoints: 2,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 3,
        avgFinish: 6.8,
        entries: 20,
        wins: 1,
        podiums: 5,
        poles: 2,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P8",
        isNext: false,
        bestFinish: 2,
        avgFinish: 7.1,
        entries: 21,
        wins: 2,
        podiums: 6,
        poles: 1,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P7",
        isNext: false,
        bestFinish: 3,
        avgFinish: 7.4,
        entries: 18,
        wins: 0,
        podiums: 3,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },

  tsunoda: {
    id: "tsunoda",
    name: "Yuki Tsunoda",
    firstName: "Yuki",
    lastName: "Tsunoda",
    code: "TSU",
    number: 22,
    team: "Red Bull",
    teamColor: "#3671C6",
    nationality: "Japanese",
    flag: "🇯🇵",
    age: 25,
    championshipPos: 10,
    stats: {
      points: 8,
      wins: 0,
      podiums: 0,
      poles: 0,
      dnfs: 0,
      bestFinish: 5,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 0.2,
      championshipChange: +0.1,
      nextRaceWinPct: 3,
      nextRaceWinChange: +0.5,
      volume: "$0.2M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 8, finish: 9, points: 2, gap: "+67.334s", fl: false },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 7, finish: 5, points: 10, gap: "+28.991s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.552s",
      sessions: [
        { round: 1, name: "AUS", pos: 8, gap: "+0.644" },
        { round: 2, name: "CHN", pos: 7, gap: "+0.460" },
      ],
    },
    h2h: {
      teammate: "Max Verstappen",
      teammateCode: "VER",
      teammateColor: "#3671C6",
      qualiWins: 0,
      qualiLosses: 2,
      raceWins: 0,
      raceLosses: 2,
      points: 8,
      teammatePoints: 25,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3 (Home)",
        isNext: true,
        bestFinish: 5,
        avgFinish: 7.2,
        entries: 4,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — P9",
        isNext: false,
        bestFinish: 6,
        avgFinish: 8.5,
        entries: 4,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P5",
        isNext: false,
        bestFinish: 5,
        avgFinish: 7.8,
        entries: 4,
        wins: 0,
        podiums: 0,
        poles: 0,
        safetyCarRate: 25,
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function finishBadgeClass(pos: number): string {
  if (pos === 1) return "bg-[#E10600] text-white";
  if (pos <= 3) return "bg-[#27F4D2]/15 text-[#27F4D2]";
  if (pos <= 10) return "bg-[#161616] text-[#666]";
  return "bg-[#0d0d0d] text-[#333]";
}

function gridBadgeClass(pos: number): string {
  if (pos === 1) return "text-[#E10600]";
  if (pos <= 3) return "text-[#27F4D2]";
  return "text-[#555]";
}

function changeColor(n: number): string {
  return n > 0 ? "text-[#22c55e]" : n < 0 ? "text-[#E10600]" : "text-[#555]";
}

function changeSign(n: number): string {
  return n > 0 ? "+" : "";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = DRIVERS_DATA[id] ?? null;

  if (!driver) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="f1-data-lg text-[#333] mb-2">Driver not found</p>
          <Link href="/drivers" className="f1-label !text-[#E10600] hover:opacity-70">
            &larr; All Drivers
          </Link>
        </div>
      </div>
    );
  }

  const totalRacePoints = driver.races.reduce((s, r) => s + r.points, 0);
  const h2hQualiTotal = driver.h2h.qualiWins + driver.h2h.qualiLosses;
  const h2hRaceTotal = driver.h2h.raceWins + driver.h2h.raceLosses;
  const h2hMaxPts = Math.max(driver.h2h.points, driver.h2h.teammatePoints);

  return (
    <DriverDetailContent
      driver={driver}
      totalRacePoints={totalRacePoints}
      h2hQualiTotal={h2hQualiTotal}
      h2hRaceTotal={h2hRaceTotal}
      h2hMaxPts={h2hMaxPts}
    />
  );
}

// ── Client-renderable content ─────────────────────────────────────────────────
// Isolated so useTranslations can stay in a single component tree

function DriverDetailContent({
  driver,
  totalRacePoints,
  h2hQualiTotal,
  h2hRaceTotal,
  h2hMaxPts,
}: {
  driver: DriverData;
  totalRacePoints: number;
  h2hQualiTotal: number;
  h2hRaceTotal: number;
  h2hMaxPts: number;
}) {
  const t = useTranslations("driver");
  const tCommon = useTranslations("common");

  const { stats, polymarket, races, qualifying, h2h, circuits } = driver;

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── Back + breadcrumb ── */}
      <div className="border-b border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-2">
          <Link
            href="/drivers"
            className="f1-transition f1-label !text-[#444] hover:!text-white flex items-center gap-1.5"
          >
            <span className="text-xs leading-none">&larr;</span>
            Drivers
          </Link>
          <span className="f1-label-xs" style={{ color: "#222" }}>/</span>
          <span className="f1-label !text-[#666]">{driver.code}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        {/* Faint grid */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Team color glow strip */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: driver.teamColor }}
        />
        <div
          className="absolute -top-40 left-0 h-80 w-80 rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ backgroundColor: driver.teamColor }}
        />

        {/* Watermark number */}
        <div className="absolute right-0 top-0 select-none pointer-events-none overflow-hidden h-full flex items-center">
          <span
            className="f1-display"
            style={{
              fontSize: "clamp(8rem, 20vw, 16rem)",
              color: driver.teamColor,
              opacity: 0.04,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {driver.number}
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* Championship badge + team */}
              <div className="flex items-center gap-2 mb-2">
                <span className="f1-label rounded bg-[#E10600] px-1.5 py-0.5 !text-white">
                  P{driver.championshipPos}
                </span>
                <div
                  className="f1-team-bar h-4"
                  style={{ backgroundColor: driver.teamColor }}
                />
                <span className="f1-label" style={{ color: driver.teamColor }}>
                  {driver.team}
                </span>
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  &middot;
                </span>
                <span className="f1-label">
                  {driver.flag} {driver.nationality}
                </span>
              </div>

              {/* Name */}
              <h1 className="f1-display-xl text-white">{driver.name}</h1>

              {/* Sub-info */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Car</span>
                  <span
                    className="f1-data text-sm font-bold"
                    style={{ color: driver.teamColor }}
                  >
                    #{driver.number}
                  </span>
                </div>
                <span style={{ color: "#1c1c1c" }}>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Age</span>
                  <span className="f1-data text-sm text-white">{driver.age}</span>
                </div>
                <span style={{ color: "#1c1c1c" }}>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Rounds</span>
                  <span className="f1-data text-sm text-white">{races.length}/22</span>
                </div>
              </div>
            </div>

            {/* Championship odds pill */}
            <div className="f1-surface px-4 py-3 sm:text-right shrink-0">
              <p className="f1-label mb-1">Championship Win Prob.</p>
              <div className="flex items-baseline gap-2 sm:justify-end">
                <span className="f1-data-xl text-white">
                  {polymarket.championshipPct}
                  <span className="f1-label text-base ml-0.5">%</span>
                </span>
                <span className={`f1-data text-xs ${changeColor(polymarket.championshipChange)}`}>
                  {changeSign(polymarket.championshipChange)}
                  {polymarket.championshipChange.toFixed(1)}%
                </span>
              </div>
              <p className="f1-label-xs mt-1" style={{ color: "#2a2a2a" }}>
                Vol {polymarket.volume} &middot; Polymarket
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-5 py-8 space-y-6">

        {/* ── Key stats grid ── */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">2026 Season Stats</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              { label: t("points"), value: stats.points, highlight: true },
              { label: t("wins"), value: stats.wins, highlight: false },
              { label: t("podiums"), value: stats.podiums, highlight: false },
              { label: t("poles"), value: stats.poles, highlight: false },
              { label: "DNFs", value: stats.dnfs, highlight: false, danger: stats.dnfs > 0 },
              { label: "Best Finish", value: `P${stats.bestFinish}`, highlight: false },
            ].map((s) => (
              <div key={s.label} className="f1-surface p-3 sm:p-4 text-center">
                <p className="f1-label-xs mb-2">{s.label}</p>
                <p
                  className={`f1-data-lg ${
                    s.highlight
                      ? "text-[#E10600]"
                      : s.danger
                      ? "text-[#E10600]"
                      : "text-white"
                  }`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Points progress bar */}
          <div className="mt-2 f1-surface p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="f1-label">Points accumulation</span>
              <span className="f1-data text-xs text-white">
                {stats.points} pts
                <span style={{ color: "#333" }}> / 2 rounds</span>
              </span>
            </div>
            <div className="h-[3px] w-full rounded-full bg-[#161616]">
              <div
                className="h-[3px] rounded-full"
                style={{
                  width: `${Math.min((stats.points / stats.pointsTarget) * 100, 100)}%`,
                  backgroundColor: driver.teamColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Two-column layout: Race results + Odds ── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Race results table — 2 cols */}
          <div className="f1-surface p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Race Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                  {races.length} races
                </span>
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5 !text-[#E10600]">
                  {totalRacePoints} pts
                </span>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_3rem_3rem_3rem_auto] items-center gap-2 mb-1 px-2">
              {["RD", "RACE", "GRD", "FIN", "PTS", "GAP"].map((h) => (
                <span key={h} className="f1-label-xs text-center last:text-right">{h}</span>
              ))}
            </div>

            <div className="space-y-1">
              {races.map((r) => (
                <div
                  key={r.round}
                  className="f1-transition f1-surface-inner grid grid-cols-[2rem_1fr_3rem_3rem_3rem_auto] items-center gap-2 px-2 py-2.5 rounded hover:bg-[#0d0d0d]"
                >
                  {/* Round */}
                  <span className="f1-data text-center text-[0.625rem]" style={{ color: "#333" }}>
                    R{r.round}
                  </span>

                  {/* Race name */}
                  <div className="min-w-0">
                    <p className="f1-body-sm font-semibold text-white truncate">{r.name}</p>
                    <p className="f1-label-xs" style={{ color: "#333" }}>{r.circuit}</p>
                  </div>

                  {/* Grid */}
                  <span className={`f1-data text-xs text-center ${gridBadgeClass(r.grid)}`}>
                    P{r.grid}
                  </span>

                  {/* Finish */}
                  <div className="flex justify-center">
                    <span
                      className={`f1-data text-[0.625rem] px-1.5 py-0.5 rounded ${finishBadgeClass(r.finish)}`}
                    >
                      P{r.finish}
                    </span>
                  </div>

                  {/* Points */}
                  <span className="f1-data text-xs text-center text-white">{r.points}</span>

                  {/* Gap */}
                  <div className="text-right flex items-center justify-end gap-1.5">
                    {r.fl && (
                      <span className="f1-label-xs rounded bg-[#9333ea]/20 px-1 py-0.5 !text-[#a855f7]">
                        FL
                      </span>
                    )}
                    <span
                      className={`f1-data text-xs ${
                        r.gap === "WINNER" ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      {r.gap}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Odds panel — 1 col */}
          <div className="space-y-4">
            {/* Championship odds */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Polymarket Odds</span>
              </div>

              {[
                {
                  label: "WDC",
                  desc: "Championship Win",
                  pct: polymarket.championshipPct,
                  change: polymarket.championshipChange,
                },
                {
                  label: "R3",
                  desc: "Japanese GP Win",
                  pct: polymarket.nextRaceWinPct,
                  change: polymarket.nextRaceWinChange,
                },
              ].map((m) => (
                <div key={m.label} className="f1-surface-inner p-3 rounded mb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="f1-label rounded bg-[#131313] px-1.5 py-0.5 !text-[#444]">
                        {m.label}
                      </span>
                      <p className="f1-body-sm mt-1 text-white">{m.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="f1-data-lg text-white">
                        {m.pct}
                        <span className="f1-label text-sm ml-0.5">%</span>
                      </p>
                      <p className={`f1-data text-[0.625rem] ${changeColor(m.change)}`}>
                        {changeSign(m.change)}{m.change.toFixed(1)}% 24h
                      </p>
                    </div>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-[#161616]">
                    <div
                      className="h-[3px] rounded-full"
                      style={{
                        width: `${m.pct}%`,
                        backgroundColor: driver.teamColor,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-3 border-t border-[#131313] pt-3 flex items-center justify-between">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  Vol {polymarket.volume}
                </span>
                <a
                  href={polymarket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                >
                  Bet on Polymarket &rarr;
                </a>
              </div>
            </div>

            {/* Qualifying pace */}
            <div className="f1-surface p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("qualifyingPace")}</span>
              </div>
              <p className="f1-label mb-4">Avg gap to pole — 2026</p>

              <div className="f1-surface-inner rounded p-3 mb-3 flex items-center justify-between">
                <span className="f1-label">Average</span>
                <span className="f1-data text-sm text-[#E10600]">
                  {qualifying.avgGapToPole}
                </span>
              </div>

              <div className="space-y-1.5">
                {qualifying.sessions.map((s) => (
                  <div
                    key={s.round}
                    className="flex items-center gap-2 f1-surface-inner px-2.5 py-2 rounded"
                  >
                    <span className="f1-label w-6 text-center">{s.name}</span>
                    <div className="flex-1">
                      <div className="h-[2px] w-full rounded-full bg-[#161616]">
                        <div
                          className="h-[2px] rounded-full"
                          style={{
                            width: s.pos === 1 ? "100%" : "60%",
                            backgroundColor: driver.teamColor,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className={`f1-data text-xs w-12 text-right ${
                        s.pos === 1 ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      {s.pos === 1 ? "POLE" : s.gap}
                    </span>
                    <span
                      className={`f1-data text-[0.625rem] w-4 text-center ${
                        s.pos === 1 ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      P{s.pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Head-to-head vs teammate ── */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("h2h")}</span>
            </div>
            <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
              {races.length} rounds
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Qualifying H2H */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Qualifying H2H</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="f1-data-lg text-white">{h2h.qualiWins}</span>
                <span className="f1-label" style={{ color: "#2a2a2a" }}>:</span>
                <span className="f1-data-lg" style={{ color: "#333" }}>{h2h.qualiLosses}</span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-[#161616] overflow-hidden">
                <div
                  className="h-[3px] rounded-full"
                  style={{
                    width: h2hQualiTotal > 0
                      ? `${(h2h.qualiWins / h2hQualiTotal) * 100}%`
                      : "50%",
                    backgroundColor: driver.teamColor,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="f1-label-xs" style={{ color: driver.teamColor }}>{driver.code}</span>
                <span className="f1-label-xs" style={{ color: "#333" }}>{h2h.teammateCode}</span>
              </div>
            </div>

            {/* Race H2H */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Race H2H</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="f1-data-lg text-white">{h2h.raceWins}</span>
                <span className="f1-label" style={{ color: "#2a2a2a" }}>:</span>
                <span className="f1-data-lg" style={{ color: "#333" }}>{h2h.raceLosses}</span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-[#161616] overflow-hidden">
                <div
                  className="h-[3px] rounded-full"
                  style={{
                    width: h2hRaceTotal > 0
                      ? `${(h2h.raceWins / h2hRaceTotal) * 100}%`
                      : "50%",
                    backgroundColor: driver.teamColor,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="f1-label-xs" style={{ color: driver.teamColor }}>{driver.code}</span>
                <span className="f1-label-xs" style={{ color: "#333" }}>{h2h.teammateCode}</span>
              </div>
            </div>

            {/* Points comparison */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Points Gap</p>
              <div className="space-y-2.5">
                {[
                  {
                    code: driver.code,
                    name: driver.name.split(" ")[1],
                    pts: h2h.points,
                    color: driver.teamColor,
                    isDriver: true,
                  },
                  {
                    code: h2h.teammateCode,
                    name: h2h.teammate.split(" ")[1],
                    pts: h2h.teammatePoints,
                    color: h2h.teammateColor,
                    isDriver: false,
                  },
                ].map((d) => (
                  <div key={d.code}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="f1-team-bar h-3"
                          style={{ backgroundColor: d.color }}
                        />
                        <span
                          className="f1-data text-[0.625rem]"
                          style={{ color: d.isDriver ? "#ededed" : "#444" }}
                        >
                          {d.code}
                        </span>
                      </div>
                      <span
                        className="f1-data text-xs"
                        style={{ color: d.isDriver ? "#ededed" : "#444" }}
                      >
                        {d.pts}
                      </span>
                    </div>
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div
                        className="h-[3px] rounded-full"
                        style={{
                          width: `${(d.pts / h2hMaxPts) * 100}%`,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="f1-label mt-3 text-center">
                +{h2h.points - h2h.teammatePoints} pts ahead
              </p>
            </div>
          </div>
        </div>

        {/* ── Circuit performance ── */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">Circuit Performance</span>
            </div>
            <span className="f1-label" style={{ color: "#333" }}>Historical &amp; 2026</span>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_3rem_4rem] items-center gap-3 mb-1 px-3">
            {["", "CIRCUIT", "NOTE", "ENTRIES", "WINS", "PODS", "POLES", "AVG FIN"].map((h) => (
              <span key={h} className="f1-label-xs text-center first:text-left">{h}</span>
            ))}
          </div>

          <div className="space-y-1">
            {circuits.map((c) => (
              <div
                key={c.name}
                className={`f1-transition rounded px-3 py-3 ${
                  c.isNext
                    ? "border border-[#E10600]/20 bg-[#E10600]/[0.02]"
                    : "f1-surface-inner"
                }`}
              >
                {/* Mobile layout */}
                <div className="sm:hidden flex items-center gap-3">
                  <span className="text-base">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="f1-display-md text-white">{c.name}</span>
                      {c.isNext && (
                        <span className="f1-label rounded bg-[#E10600] px-1 py-0.5 !text-white shrink-0">
                          Next
                        </span>
                      )}
                    </div>
                    <p className="f1-label-xs mt-0.5" style={{ color: "#333" }}>{c.note}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="f1-data text-xs text-white">
                      P{c.bestFinish} best
                    </p>
                    <p className="f1-data text-[0.625rem]" style={{ color: "#444" }}>
                      {c.avgFinish.toFixed(1)} avg
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_3rem_4rem] items-center gap-3">
                  <span className="text-base">{c.flag}</span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="f1-display-md text-white truncate">{c.name}</span>
                      {c.isNext && (
                        <span className="f1-label rounded bg-[#E10600] px-1 py-0.5 !text-white shrink-0">
                          Next
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="f1-label-xs text-center truncate" style={{ color: "#333" }}>
                    {c.note.split("—")[0].trim()}
                  </span>

                  <span className="f1-data text-xs text-center text-white">{c.entries}</span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.wins > 0 ? "text-[#E10600]" : "text-[#333]"
                    }`}
                  >
                    {c.wins}
                  </span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.podiums > 0 ? "text-[#27F4D2]" : "text-[#333]"
                    }`}
                  >
                    {c.podiums}
                  </span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.poles > 0 ? "text-white" : "text-[#333]"
                    }`}
                  >
                    {c.poles}
                  </span>

                  <div className="text-center">
                    <span className="f1-data text-xs text-white">
                      P{c.bestFinish}
                    </span>
                    <span className="f1-label-xs ml-1" style={{ color: "#333" }}>
                      / {c.avgFinish.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* SC probability strip */}
                {c.isNext && (
                  <div className="mt-3 border-t border-[#1c1c1c] pt-3">
                    <div className="flex items-center gap-3">
                      <span className="f1-label" style={{ color: "#555" }}>
                        SC probability at {c.name}
                      </span>
                      <div className="flex-1 h-[2px] rounded-full bg-[#161616]">
                        <div
                          className="h-[2px] rounded-full bg-[#f59e0b]"
                          style={{ width: `${c.safetyCarRate}%` }}
                        />
                      </div>
                      <span className="f1-data text-xs text-[#f59e0b]">
                        {c.safetyCarRate}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="border-t border-[#131313] pt-5 flex items-center justify-between">
          <p className="f1-label-xs" style={{ color: "#222" }}>
            {tCommon("appName")} &middot; 2026 Season &middot; Data through R{races.length}
          </p>
          <Link
            href="/drivers"
            className="f1-transition f1-label !text-[#333] hover:!text-white flex items-center gap-1"
          >
            &larr; All Drivers
          </Link>
        </div>
      </div>
    </div>
  );
}
