// F1 Pulse — Core Types

// ── Race & Calendar ──────────────────────────────────────────────
export interface Race {
  id: string;
  season: number;
  round: number;
  name: string;
  officialName: string;
  circuit: Circuit;
  date: string; // ISO date
  time: string; // ISO time
  isSprint: boolean;
  sessions: Session[];
}

export interface Session {
  type: "FP1" | "FP2" | "FP3" | "Qualifying" | "Sprint" | "Race";
  date: string;
  time: string;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  length: number; // km
  turns: number;
  lapRecord?: string;
}

// ── Drivers & Teams ──────────────────────────────────────────────
export interface Driver {
  id: string;
  number: number;
  code: string; // e.g. "RUS"
  firstName: string;
  lastName: string;
  nationality: string;
  teamId: string;
  photoUrl?: string;
  stats: DriverStats;
}

export interface DriverStats {
  wins: number;
  podiums: number;
  poles: number;
  points: number;
  championshipPosition: number;
  dnfRate: number;
  avgQualifyingGap: number; // gap to pole in seconds
}

export interface Team {
  id: string;
  name: string;
  fullName: string;
  nationality: string;
  color: string; // hex
  logoUrl?: string;
  drivers: string[]; // driver IDs
  stats: TeamStats;
}

export interface TeamStats {
  wins: number;
  podiums: number;
  points: number;
  championshipPosition: number;
  dnfRate: number;
}

// ── Polymarket ───────────────────────────────────────────────────
export interface Market {
  id: string;
  conditionId: string;
  slug: string;
  question: string;
  category: MarketCategory;
  outcomes: Outcome[];
  volume: number; // USDC
  liquidity: number;
  endDate: string;
  active: boolean;
  polymarketUrl: string;
}

export type MarketCategory =
  | "championship"
  | "race_winner"
  | "podium"
  | "head_to_head"
  | "prop"
  | "other";

export interface Outcome {
  name: string;
  price: number; // 0-1 probability
  volume: number;
}

// ── Analytics ────────────────────────────────────────────────────
export interface CircuitHistory {
  circuitId: string;
  races: HistoricalRace[];
  safetyCarRate: number;
  avgOvertakes: number;
  weatherHistory: WeatherSummary[];
}

export interface HistoricalRace {
  season: number;
  winnerId: string;
  winnerName: string;
  poleId: string;
  poleName: string;
  safetyCar: boolean;
  wetRace: boolean;
}

export interface WeatherSummary {
  date: string;
  condition: string;
  tempC: number;
  rainProbability: number;
}

// ── List Item Types (used by data-layer functions) ─────────────
export interface RaceListItem {
  slug: string;
  round: number;
  name: string;
  circuit: string;
  date: string; // display date e.g. "MAR 06"
  isoDate?: string; // full ISO date for countdown
  winner?: string;
  code?: string;
  color?: string;
  completed: boolean;
  next?: boolean;
  sprint?: boolean;
}

export interface DriverListItem {
  id: string;
  name: string;
  code: string;
  team: string;
  number: number;
  pts: number;
  wins: number;
  podiums: number;
  poles: number;
  pos: number;
  color: string;
}

export interface TeamListItem {
  id: string;
  name: string;
  drivers: string[];
  pts: number;
  wins: number;
  podiums: number;
  pos: number;
  color: string;
}

export interface ChampionshipOddsItem {
  name: string;
  code: string;
  odds: number;
  volume: string;
  change: number;
  color: string;
}

export interface MarketListItem {
  question: string;
  volume: string;
  endDate: string;
  outcomes: { name: string; code: string; price: number; color: string }[];
}

export interface MarketsData {
  championship: MarketListItem[];
  raceWinner: MarketListItem[];
  props: MarketListItem[];
}

export interface HomepageData {
  nextRace: {
    name: string;
    nameZh: string;
    circuit: string;
    circuitZh: string;
    date: string;
    round: number;
    isSprint: boolean;
  };
  standings: { pos: number; id: string; name: string; code: string; pts: number; color: string }[];
  recent: { round: number; slug: string; name: string; code: string; color: string }[];
  maxPts: number;
}

// ── API Response Wrapper ─────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  cached: boolean;
}
