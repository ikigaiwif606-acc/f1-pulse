import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// ── Types ───────────────────────────────────────────────────────────────────

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
  championship: { pos: number; pts: number; wins: number; podiums: number; poles: number; dnfs: number };
  polymarket: { probability: number; volume: string; question: string; url: string };
  drivers: [Driver, Driver];
  raceResults: { round: number; race: string; d1: number; d2: number; teamPts: number }[];
  technical: {
    powerUnit: string;
    chassis: string;
    tyreSupplier: string;
    base: string;
    technicalDirector: string;
    reg2026: string[];
  };
}

// ── Static data ────────────────────────────────────────────────────────────────

const TEAMS_DATA: Record<string, TeamData> = {
  mercedes: {
    id: "mercedes",
    name: "Mercedes",
    fullName: "Mercedes-AMG Petronas F1 Team",
    color: "#27F4D2",
    championship: { pos: 1, pts: 88, wins: 2, podiums: 4, poles: 2, dnfs: 0 },
    polymarket: {
      probability: 0.65,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "russell",
        name: "George Russell",
        code: "RUS",
        number: 63,
        nationality: "British",
        pts: 51,
        wins: 2,
        podiums: 2,
        poles: 2,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 4,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "antonelli",
        name: "Kimi Antonelli",
        code: "ANT",
        number: 12,
        nationality: "Italian",
        pts: 37,
        wins: 1,
        podiums: 2,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 2,
        raceH2H: 3,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 1, d2: 3, teamPts: 28 },
      { round: 2, race: "Chinese GP",    d1: 2, d2: 1, teamPts: 28 },
    ],
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
    id: "ferrari",
    name: "Ferrari",
    fullName: "Scuderia Ferrari HP",
    color: "#E80020",
    championship: { pos: 2, pts: 53, wins: 0, podiums: 3, poles: 0, dnfs: 0 },
    polymarket: {
      probability: 0.16,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "leclerc",
        name: "Charles Leclerc",
        code: "LEC",
        number: 16,
        nationality: "Monégasque",
        pts: 31,
        wins: 0,
        podiums: 2,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 4,
        raceH2H: 4,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "hamilton",
        name: "Lewis Hamilton",
        code: "HAM",
        number: 44,
        nationality: "British",
        pts: 22,
        wins: 0,
        podiums: 1,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 3,
        raceH2H: 3,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 3, d2: 4, teamPts: 27 },
      { round: 2, race: "Chinese GP",    d1: 2, d2: 5, teamPts: 26 },
    ],
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
    id: "mclaren",
    name: "McLaren",
    fullName: "McLaren Formula 1 Team",
    color: "#FF8000",
    championship: { pos: 3, pts: 48, wins: 0, podiums: 1, poles: 0, dnfs: 0 },
    polymarket: {
      probability: 0.10,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "norris",
        name: "Lando Norris",
        code: "NOR",
        number: 4,
        nationality: "British",
        pts: 28,
        wins: 0,
        podiums: 1,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 4,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "piastri",
        name: "Oscar Piastri",
        code: "PIA",
        number: 81,
        nationality: "Australian",
        pts: 20,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 2,
        raceH2H: 3,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 4, d2: 6, teamPts: 22 },
      { round: 2, race: "Chinese GP",    d1: 3, d2: 7, teamPts: 26 },
    ],
    technical: {
      powerUnit: "Mercedes-AMG F1 M17 E Performance",
      chassis: "MCL39",
      tyreSupplier: "Pirelli",
      base: "Woking, England",
      technicalDirector: "Peter Prodromou",
      reg2026: [
        "Customer Mercedes power unit transition to 2026 spec hybrid architecture",
        "Aggressive MCL39 concept with revised sidepod geometry under new regs",
        "Active aero system designed for high-speed stability under 2026 rules",
        "Norris and Piastri retain strong driver lineup from championship-winning 2025",
      ],
    },
  },

  redbull: {
    id: "redbull",
    name: "Red Bull",
    fullName: "Oracle Red Bull Racing",
    color: "#3671C6",
    championship: { pos: 4, pts: 33, wins: 0, podiums: 1, poles: 0, dnfs: 1 },
    polymarket: {
      probability: 0.05,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "verstappen",
        name: "Max Verstappen",
        code: "VER",
        number: 1,
        nationality: "Dutch",
        pts: 25,
        wins: 0,
        podiums: 1,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 6,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "tsunoda",
        name: "Yuki Tsunoda",
        code: "TSU",
        number: 22,
        nationality: "Japanese",
        pts: 8,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 1,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 5, d2: 0, teamPts: 10 },
      { round: 2, race: "Chinese GP",    d1: 3, d2: 8, teamPts: 23 },
    ],
    technical: {
      powerUnit: "Honda RBPTH002",
      chassis: "RB22",
      tyreSupplier: "Pirelli",
      base: "Milton Keynes, England",
      technicalDirector: "Pierre Waché",
      reg2026: [
        "Honda power unit transition to full 2026 hybrid specification",
        "RB22 developed under new aerodynamic framework with active aero",
        "Team adapting to new regulations after dominant stretch under old rules",
        "Tsunoda promoted to race seat following Pérez departure",
      ],
    },
  },

  aston_martin: {
    id: "aston_martin",
    name: "Aston Martin",
    fullName: "Aston Martin Aramco F1 Team",
    color: "#229971",
    championship: { pos: 5, pts: 14, wins: 0, podiums: 0, poles: 0, dnfs: 0 },
    polymarket: {
      probability: 0.02,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "alonso",
        name: "Fernando Alonso",
        code: "ALO",
        number: 14,
        nationality: "Spanish",
        pts: 10,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "stroll",
        name: "Lance Stroll",
        code: "STR",
        number: 18,
        nationality: "Canadian",
        pts: 4,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 2,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 6, d2: 9, teamPts: 10 },
      { round: 2, race: "Chinese GP",    d1: 7, d2: 10, teamPts: 4 },
    ],
    technical: {
      powerUnit: "Honda RBPTH002",
      chassis: "AMR26",
      tyreSupplier: "Pirelli",
      base: "Silverstone, England",
      technicalDirector: "Enrico Cardile",
      reg2026: [
        "AMR26 designed from clean sheet for 2026 regulation overhaul",
        "Honda power unit partnership continues into new hybrid era",
        "New factory infrastructure at Silverstone supports 2026 development",
        "Alonso aiming to challenge for podiums in first full season under new regs",
      ],
    },
  },

  audi: {
    id: "audi",
    name: "Audi",
    fullName: "Audi F1 Team (formerly Sauber)",
    color: "#00594F",
    championship: { pos: 6, pts: 14, wins: 0, podiums: 0, poles: 0, dnfs: 1 },
    polymarket: {
      probability: 0.01,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "hulkenberg",
        name: "Nico Hülkenberg",
        code: "HUL",
        number: 27,
        nationality: "German",
        pts: 12,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "bortoleto",
        name: "Gabriel Bortoleto",
        code: "BOR",
        number: 5,
        nationality: "Brazilian",
        pts: 2,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 2,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 7, d2: 0, teamPts: 6 },
      { round: 2, race: "Chinese GP",    d1: 8, d2: 11, teamPts: 8 },
    ],
    technical: {
      powerUnit: "Audi F1 Power Unit",
      chassis: "C46",
      tyreSupplier: "Pirelli",
      base: "Hinwil, Switzerland",
      technicalDirector: "Mattia Binotto",
      reg2026: [
        "First season as Audi F1 Team after full takeover of Sauber operations",
        "Audi-branded power unit makes its Formula 1 debut in 2026",
        "Significant infrastructure investment at Hinwil facility ahead of 2026",
        "Hülkenberg and Bortoleto lead the team's ambitious multi-year project",
      ],
    },
  },

  alpine: {
    id: "alpine",
    name: "Alpine",
    fullName: "BWT Alpine F1 Team",
    color: "#0093CC",
    championship: { pos: 7, pts: 8, wins: 0, podiums: 0, poles: 0, dnfs: 0 },
    polymarket: {
      probability: 0.005,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "gasly",
        name: "Pierre Gasly",
        code: "GAS",
        number: 10,
        nationality: "French",
        pts: 5,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "doohan",
        name: "Jack Doohan",
        code: "DOO",
        number: 7,
        nationality: "Australian",
        pts: 3,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 2,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 9, d2: 11, teamPts: 2 },
      { round: 2, race: "Chinese GP",    d1: 8, d2: 9,  teamPts: 6 },
    ],
    technical: {
      powerUnit: "Renault E-Tech RE26",
      chassis: "A526",
      tyreSupplier: "Pirelli",
      base: "Enstone, England",
      technicalDirector: "David Sanchez",
      reg2026: [
        "Renault power unit fully rebuilt for 2026 regulation requirements",
        "A526 designed around revised 2026 aerodynamic and dimensional rules",
        "Team consolidating after management restructure in late 2025",
        "Doohan retains seat for second season alongside experienced Gasly",
      ],
    },
  },

  haas: {
    id: "haas",
    name: "Haas",
    fullName: "MoneyGram Haas F1 Team",
    color: "#B6BABD",
    championship: { pos: 8, pts: 5, wins: 0, podiums: 0, poles: 0, dnfs: 1 },
    polymarket: {
      probability: 0.003,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "ocon",
        name: "Esteban Ocon",
        code: "OCO",
        number: 31,
        nationality: "French",
        pts: 3,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 5,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "bearman",
        name: "Oliver Bearman",
        code: "BEA",
        number: 87,
        nationality: "British",
        pts: 2,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 2,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 10, d2: 0,  teamPts: 1 },
      { round: 2, race: "Chinese GP",    d1: 10, d2: 12, teamPts: 4 },
    ],
    technical: {
      powerUnit: "Ferrari 066/10",
      chassis: "VF-26",
      tyreSupplier: "Pirelli",
      base: "Kannapolis, USA",
      technicalDirector: "Simone Resta",
      reg2026: [
        "Customer Ferrari power unit upgraded to 2026 specification",
        "VF-26 marks Haas's most ambitious technical development programme to date",
        "Ocon joins from Alpine to bring experience to the American outfit",
        "Bearman given full season after impressive substitute appearances in 2025",
      ],
    },
  },

  williams: {
    id: "williams",
    name: "Williams",
    fullName: "Williams Racing",
    color: "#1868DB",
    championship: { pos: 9, pts: 4, wins: 0, podiums: 0, poles: 0, dnfs: 1 },
    polymarket: {
      probability: 0.002,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "sainz",
        name: "Carlos Sainz",
        code: "SAI",
        number: 55,
        nationality: "Spanish",
        pts: 3,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        qualifyingH2H: 6,
        raceH2H: 5,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "albon",
        name: "Alexander Albon",
        code: "ALB",
        number: 23,
        nationality: "Thai",
        pts: 1,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 1,
        raceH2H: 2,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 11, d2: 0,  teamPts: 0 },
      { round: 2, race: "Chinese GP",    d1: 10, d2: 13, teamPts: 4 },
    ],
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
    id: "cadillac",
    name: "Cadillac",
    fullName: "Cadillac F1 Team",
    color: "#C0C0C0",
    championship: { pos: 10, pts: 0, wins: 0, podiums: 0, poles: 0, dnfs: 2 },
    polymarket: {
      probability: 0.001,
      volume: "$12.1M",
      question: "Who will win the 2026 Constructors' Championship?",
      url: "https://polymarket.com",
    },
    drivers: [
      {
        id: "cadillac_d1",
        name: "TBD",
        code: "TBD",
        number: 0,
        nationality: "TBD",
        pts: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 3,
        raceH2H: 3,
        totalSessions: 7,
        totalRaces: 7,
      },
      {
        id: "cadillac_d2",
        name: "TBD",
        code: "TBD",
        number: 0,
        nationality: "TBD",
        pts: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 1,
        qualifyingH2H: 4,
        raceH2H: 4,
        totalSessions: 7,
        totalRaces: 7,
      },
    ],
    raceResults: [
      { round: 1, race: "Australian GP", d1: 0, d2: 0, teamPts: 0 },
      { round: 2, race: "Chinese GP",    d1: 0, d2: 0, teamPts: 0 },
    ],
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
};

// ── Ordinal helper ─────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

// ── Position badge helper ──────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: number }) {
  return (
    <span
      className="f1-label rounded px-2 py-1 text-white"
      style={{ background: "#E10600", fontSize: "0.625rem" }}
    >
      P{pos}
    </span>
  );
}

// ── Finish cell helper ─────────────────────────────────────────────────────────

function FinishCell({ pos }: { pos: number }) {
  if (pos === 0) {
    return (
      <span className="f1-data text-sm" style={{ color: "#444" }}>
        DNF
      </span>
    );
  }
  const isPodium = pos <= 3;
  const isWin = pos === 1;
  return (
    <span
      className="f1-data text-sm"
      style={{
        color: isWin ? "#E10600" : isPodium ? "#27F4D2" : "#666",
      }}
    >
      P{pos}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = TEAMS_DATA[id] ?? null;

  if (!team) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="f1-display-md text-white mb-3">Team not found</p>
          <Link href="/teams" className="f1-transition f1-label !text-[#E10600] hover:opacity-70">
            &larr; Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const [d1, d2] = team.drivers;
  const maxPts = d1.pts; // d1 always leads

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <Link
            href="/teams"
            className="f1-transition f1-label hover:!text-white inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Constructors&apos; Championship</span>
          </Link>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Team color accent bar */}
            <div
              className="mt-1 hidden shrink-0 sm:block"
              style={{
                width: "4px",
                height: "64px",
                borderRadius: "2px",
                background: team.color,
              }}
            />
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <PosBadge pos={team.championship.pos} />
                <span className="f1-label" style={{ color: team.color }}>
                  {team.championship.pos === 1
                    ? "Constructors\u2019 Championship Leader"
                    : `${ordinal(team.championship.pos)} in Constructors\u2019 Championship`}
                </span>
              </div>
              <h1 className="f1-display-xl text-white">{team.name}</h1>
              <p className="f1-body-sm mt-1" style={{ color: "#555" }}>
                {team.fullName}
              </p>
            </div>
          </div>

          {/* Season marker */}
          <div className="hidden text-right sm:block">
            <p className="f1-label-xs">2026 Season</p>
            <p className="f1-data-lg mt-0.5" style={{ color: "#444" }}>
              R2<span style={{ color: "#2a2a2a" }}>/</span>22
            </p>
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {[
            { label: "Points",   value: team.championship.pts,    accent: true },
            { label: "Wins",     value: team.championship.wins,   accent: false },
            { label: "Podiums",  value: team.championship.podiums,accent: false },
            { label: "Poles",    value: team.championship.poles,  accent: false },
            { label: "DNFs",     value: team.championship.dnfs,   accent: false },
            { label: "Position", value: `P${team.championship.pos}`, accent: false },
          ].map((s) => (
            <div key={s.label} className="f1-surface p-3 text-center">
              <p className="f1-label-xs mb-1.5">{s.label}</p>
              <p
                className="f1-data-lg"
                style={{ color: s.accent ? team.color : "white" }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Left column — Polymarket + Driver comparison */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* Constructors odds */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Constructors&apos; Championship Odds</span>
              </div>

              <div className="flex items-center gap-4 f1-surface-inner p-4">
                <div className="flex-1">
                  <p className="f1-body-sm text-white font-semibold mb-1">{team.polymarket.question}</p>
                  <p className="f1-label">Vol {team.polymarket.volume} &middot; Ends Dec 6, 2026</p>
                </div>
                <div className="shrink-0 text-center">
                  <div
                    className="rounded border px-4 py-2"
                    style={{ borderColor: team.color + "40", background: team.color + "0d" }}
                  >
                    <p
                      className="f1-data-lg"
                      style={{ color: team.color }}
                    >
                      {(team.polymarket.probability * 100).toFixed(0)}
                      <span className="f1-label-xs ml-0.5" style={{ color: team.color, opacity: 0.7 }}>%</span>
                    </p>
                    <p className="f1-label-xs mt-0.5" style={{ color: team.color, opacity: 0.6 }}>Win Prob</p>
                  </div>
                </div>
              </div>

              {/* Probability bar */}
              <div className="mt-3">
                <div className="h-[3px] w-full rounded-full bg-[#161616]">
                  <div
                    className="h-[3px] rounded-full f1-transition"
                    style={{
                      width: `${team.polymarket.probability * 100}%`,
                      background: team.color,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#131313] pt-3">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  Last updated: 2 min ago
                </span>
                <a
                  href={team.polymarket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                >
                  Bet on Polymarket &rarr;
                </a>
              </div>
            </div>

            {/* Driver comparison panel */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Driver Comparison</span>
              </div>

              {/* Driver name headers */}
              <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                {/* D1 */}
                <div className="flex items-center gap-2">
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color }} />
                  <div>
                    <p className="f1-display-md text-white">{d1.code}</p>
                    <p className="f1-label-xs">{d1.name}</p>
                  </div>
                </div>
                {/* VS */}
                <div className="f1-label text-center" style={{ color: "#2a2a2a" }}>VS</div>
                {/* D2 */}
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="f1-display-md text-white">{d2.code}</p>
                    <p className="f1-label-xs">{d2.name}</p>
                  </div>
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color, opacity: 0.45 }} />
                </div>
              </div>

              {/* Stat rows */}
              <div className="space-y-3">
                {/* Points */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.pts}</span>
                    <span className="f1-label">Points</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.pts}</span>
                  </div>
                  {(d1.pts + d2.pts) > 0 && (
                    <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                      <div
                        className="h-full f1-transition"
                        style={{
                          width: `${(d1.pts / (d1.pts + d2.pts)) * 100}%`,
                          background: team.color,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Wins */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.wins}</span>
                    <span className="f1-label">Wins</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.wins}</span>
                  </div>
                  {(d1.wins + d2.wins) > 0 && (
                    <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                      <div
                        className="h-full f1-transition"
                        style={{
                          width: `${(d1.wins / (d1.wins + d2.wins)) * 100}%`,
                          background: team.color,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Qualifying H2H */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.qualifyingH2H}</span>
                    <span className="f1-label">Qualifying H2H</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.qualifyingH2H}</span>
                  </div>
                  <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                    <div
                      className="h-full f1-transition"
                      style={{
                        width: `${(d1.qualifyingH2H / d1.totalSessions) * 100}%`,
                        background: team.color,
                      }}
                    />
                  </div>
                </div>

                {/* Race H2H */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.raceH2H}</span>
                    <span className="f1-label">Race H2H</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.raceH2H}</span>
                  </div>
                  <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                    <div
                      className="h-full f1-transition"
                      style={{
                        width: `${(d1.raceH2H / d1.totalRaces) * 100}%`,
                        background: team.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Individual stat pills */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[d1, d2].map((d, i) => (
                  <div key={d.id} className="f1-surface-inner p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <div
                        className="f1-team-bar h-4"
                        style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }}
                      />
                      <span className="f1-label !text-white">{d.code}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "POD", value: d.podiums },
                        { label: "POL", value: d.poles },
                        { label: "DNF", value: d.dnfs },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="f1-label-xs">{s.label}</p>
                          <p className="f1-data text-sm text-white mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Race-by-race results */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Race-by-Race Results</span>
              </div>

              {/* Table header */}
              <div className="mb-1 grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] gap-2 px-2">
                <span className="f1-label-xs">RND</span>
                <span className="f1-label-xs">Race</span>
                <span className="f1-label-xs text-center">{d1.code}</span>
                <span className="f1-label-xs text-center">{d2.code}</span>
                <span className="f1-label-xs text-right">Team PTS</span>
              </div>

              <div className="space-y-1">
                {team.raceResults.map((r) => (
                  <div
                    key={r.round}
                    className="f1-transition grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] items-center gap-2 f1-surface-inner px-2 py-2.5 hover:bg-[#0d0d0d]"
                  >
                    <span className="f1-data text-[0.625rem] text-center" style={{ color: "#444" }}>
                      {String(r.round).padStart(2, "0")}
                    </span>
                    <span className="f1-body-sm text-white truncate">{r.race}</span>
                    <div className="text-center">
                      <FinishCell pos={r.d1} />
                    </div>
                    <div className="text-center">
                      <FinishCell pos={r.d2} />
                    </div>
                    <div className="text-right">
                      <span className="f1-data text-sm" style={{ color: team.color }}>
                        +{r.teamPts}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Points bar for each completed race */}
              <div className="mt-3 border-t border-[#131313] pt-3">
                <div className="flex items-center justify-between">
                  <span className="f1-label">2 of 22 races completed</span>
                  <span className="f1-data text-sm" style={{ color: team.color }}>
                    {team.championship.pts} pts
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] w-full rounded-full bg-[#161616]">
                  <div
                    className="h-[3px] rounded-full f1-transition"
                    style={{ width: `${(2 / 22) * 100}%`, background: team.color }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Driver cards + Technical */}
          <div className="flex flex-col gap-4">

            {/* Driver cards */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Drivers</span>
              </div>

              <div className="space-y-2">
                {team.drivers.map((d, i) => {
                  const ptsShare = team.championship.pts > 0
                    ? Math.round((d.pts / team.championship.pts) * 100)
                    : 0;
                  return (
                    <div key={d.id} className="f1-hover f1-surface-inner p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="f1-team-bar h-8"
                            style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }}
                          />
                          <div>
                            <p className="f1-display-md text-white">{d.name}</p>
                            <p className="f1-label-xs">{d.nationality}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="f1-display"
                            style={{ fontSize: "2rem", color: team.color, opacity: i === 0 ? 0.2 : 0.1, lineHeight: 1 }}
                          >
                            {d.number}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: "PTS", value: d.pts },
                          { label: "WIN", value: d.wins },
                          { label: "POD", value: d.podiums },
                          { label: "POL", value: d.poles },
                        ].map((s) => (
                          <div key={s.label} className="rounded bg-[#0a0a0a] p-1.5 text-center">
                            <p className="f1-label-xs">{s.label}</p>
                            <p className="f1-data text-sm text-white mt-0.5">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="f1-label-xs">Points share</span>
                          <span className="f1-label-xs" style={{ color: team.color }}>{ptsShare}%</span>
                        </div>
                        <div className="h-[2px] w-full rounded-full bg-[#161616]">
                          <div
                            className="h-[2px] rounded-full f1-transition"
                            style={{ width: maxPts > 0 ? `${(d.pts / maxPts) * 100}%` : "0%", background: team.color, opacity: i === 0 ? 1 : 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical info */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Technical</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Power Unit",   value: team.technical.powerUnit },
                  { label: "Chassis",      value: team.technical.chassis },
                  { label: "Tyres",        value: team.technical.tyreSupplier },
                  { label: "Base",         value: team.technical.base },
                  { label: "Tech Director",value: team.technical.technicalDirector },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 f1-surface-inner px-3 py-2">
                    <span className="f1-label-xs">{row.label}</span>
                    <span className="f1-body-sm text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <div className="f1-accent-bar" style={{ background: "#E10600", height: "10px" }} />
                  <span className="f1-label !text-[#E10600]">2026 Reg Changes</span>
                </div>
                <ul className="space-y-1.5">
                  {team.technical.reg2026.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 f1-surface-inner px-3 py-2">
                      <span className="f1-data text-[0.5625rem] mt-0.5 shrink-0" style={{ color: "#2a2a2a" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="f1-body-sm" style={{ color: "#777" }}>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick links */}
            <div className="f1-surface p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Explore</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { href: "/teams",   label: "All Constructors" },
                  { href: "/drivers", label: "Driver Standings" },
                  { href: "/markets", label: "Polymarket Odds" },
                  { href: "/races",   label: "Race Calendar" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href as "/"}
                    className="f1-transition f1-hover flex items-center justify-between f1-surface-inner px-3 py-2.5"
                  >
                    <span className="f1-body-sm text-white">{link.label}</span>
                    <span className="f1-label" style={{ color: "#333" }}>&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
