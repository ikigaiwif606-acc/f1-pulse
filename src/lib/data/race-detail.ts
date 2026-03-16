import { getSeasonSchedule, getRoundResults, getCircuitWinners } from "@/lib/api/ergast";
import { getRacesList } from "./races";
import { getTeamColor } from "./transformers";

// ── Types ────────────────────────────────────────────────────────────────────

type Session = { label: string; day: string; date: string; time: string; utc: string };
type Outcome = { name: string; code: string; team: string; price: number; color: string; change: number };
type Winner = { year: number; driver: string; code: string; team: string; color: string };
type WeatherDay = { day: string; date: string; condition: string; temp_hi: number; temp_lo: number; rain: number; wind: string; icon: string };
type ResultEntry = { pos: number; driver: string; code: string; team: string; color: string; time?: string };

type CircuitInfo = {
  length: string; turns: number; lap_record: string; lap_record_holder: string;
  lap_record_year: number; drs_zones: number; overtake_mode_zones: number;
  layout: string; direction: string;
};

type Polymarket = {
  question: string; volume: string; market_url: string; updated: string; outcomes: Outcome[];
};

export type RaceData = {
  id: string;
  name: string;
  circuit: string;
  country: string;
  flag: string;
  round: number;
  season: number;
  date: string;
  sprint?: boolean;
  completed?: boolean;
  hero: { locality: string };
  sessions: Session[];
  circuit_info: CircuitInfo;
  polymarket: Polymarket;
  history: { safety_car_rate: number; avg_overtakes: number; last_winners: Winner[] };
  weather: WeatherDay[];
  results?: ResultEntry[];
};

// ── Country → Flag ───────────────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "\u{1F1E6}\u{1F1FA}", China: "\u{1F1E8}\u{1F1F3}", Japan: "\u{1F1EF}\u{1F1F5}",
  Bahrain: "\u{1F1E7}\u{1F1ED}", "Saudi Arabia": "\u{1F1F8}\u{1F1E6}", USA: "\u{1F1FA}\u{1F1F8}",
  Canada: "\u{1F1E8}\u{1F1E6}", Monaco: "\u{1F1F2}\u{1F1E8}", Spain: "\u{1F1EA}\u{1F1F8}",
  Austria: "\u{1F1E6}\u{1F1F9}", UK: "\u{1F1EC}\u{1F1E7}", Belgium: "\u{1F1E7}\u{1F1EA}",
  Hungary: "\u{1F1ED}\u{1F1FA}", Netherlands: "\u{1F1F3}\u{1F1F1}", Italy: "\u{1F1EE}\u{1F1F9}",
  Azerbaijan: "\u{1F1E6}\u{1F1FF}", Singapore: "\u{1F1F8}\u{1F1EC}", Mexico: "\u{1F1F2}\u{1F1FD}",
  Brazil: "\u{1F1E7}\u{1F1F7}", Qatar: "\u{1F1F6}\u{1F1E6}",
  "United Arab Emirates": "\u{1F1E6}\u{1F1EA}", "United States": "\u{1F1FA}\u{1F1F8}",
  "United Kingdom": "\u{1F1EC}\u{1F1E7}",
};

// ── Static enrichment data (fields that can't come from APIs) ────────────────

type StaticEnrichment = {
  circuit_info: CircuitInfo;
  polymarket: Polymarket;
  weather: WeatherDay[];
  safety_car_rate: number;
  avg_overtakes: number;
};

const STATIC_RACE_DATA: Record<string, StaticEnrichment> = {
  "australian-gp": {
    circuit_info: { length: "5.278 km", turns: 16, lap_record: "1:20.235", lap_record_holder: "Charles Leclerc", lap_record_year: 2022, drs_zones: 4, overtake_mode_zones: 4, layout: "Street/Park", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Australian Grand Prix?", volume: "$1.8M", market_url: "https://polymarket.com/event/f1-australian-gp-2026", updated: "Race completed", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.38, color: "#27F4D2", change: +0.10 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.24, color: "#27F4D2", change: +0.06 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.04 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.10, color: "#3671C6", change: -0.03 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.08, color: "#FF8000", change: -0.02 },
      { name: "Field", code: "FLD", team: "Others", price: 0.04, color: "#444", change: -0.07 },
    ] },
    weather: [
      { day: "Thursday", date: "04 Mar", condition: "Partly Cloudy", temp_hi: 24, temp_lo: 16, rain: 15, wind: "14 km/h SW", icon: "partly-cloudy" },
      { day: "Saturday", date: "05 Mar", condition: "Mostly Sunny", temp_hi: 27, temp_lo: 17, rain: 5, wind: "10 km/h S", icon: "sunny" },
      { day: "Sunday", date: "06 Mar", condition: "Sunny", temp_hi: 28, temp_lo: 18, rain: 0, wind: "8 km/h SE", icon: "sunny" },
    ],
    safety_car_rate: 60, avg_overtakes: 22,
  },
  "chinese-gp": {
    circuit_info: { length: "5.451 km", turns: 16, lap_record: "1:32.238", lap_record_holder: "Michael Schumacher", lap_record_year: 2004, drs_zones: 2, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Chinese Grand Prix?", volume: "$2.1M", market_url: "https://polymarket.com/event/f1-chinese-gp-2026", updated: "Race completed", outcomes: [
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.32, color: "#27F4D2", change: +0.08 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.25, color: "#27F4D2", change: -0.03 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.18, color: "#E80020", change: +0.02 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.11, color: "#3671C6", change: -0.02 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.09, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.05, color: "#444", change: -0.06 },
    ] },
    weather: [
      { day: "Thursday", date: "11 Mar", condition: "Overcast", temp_hi: 13, temp_lo: 7, rain: 30, wind: "18 km/h NE", icon: "cloudy" },
      { day: "Saturday", date: "12 Mar", condition: "Partly Cloudy", temp_hi: 15, temp_lo: 8, rain: 20, wind: "14 km/h N", icon: "partly-cloudy" },
      { day: "Sunday", date: "13 Mar", condition: "Mostly Sunny", temp_hi: 17, temp_lo: 9, rain: 10, wind: "10 km/h NW", icon: "sunny" },
    ],
    safety_car_rate: 42, avg_overtakes: 34,
  },
  "japanese-gp": {
    circuit_info: { length: "5.807 km", turns: 18, lap_record: "1:30.983", lap_record_holder: "Lewis Hamilton", lap_record_year: 2019, drs_zones: 2, overtake_mode_zones: 3, layout: "Figure-8", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Japanese Grand Prix?", volume: "$2.4M", market_url: "https://polymarket.com/event/f1-japanese-gp-2026", updated: "5 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.28, color: "#27F4D2", change: +0.03 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.05 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.15, color: "#E80020", change: -0.02 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.12, color: "#3671C6", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.02 },
      { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.07, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.06, color: "#444", change: -0.08 },
    ] },
    weather: [
      { day: "Friday", date: "27 Mar", condition: "Overcast", temp_hi: 14, temp_lo: 9, rain: 20, wind: "12 km/h NW", icon: "cloudy" },
      { day: "Saturday", date: "28 Mar", condition: "Partly Cloudy", temp_hi: 16, temp_lo: 10, rain: 10, wind: "8 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "29 Mar", condition: "Mostly Sunny", temp_hi: 17, temp_lo: 11, rain: 5, wind: "10 km/h SW", icon: "sunny" },
    ],
    safety_car_rate: 35, avg_overtakes: 28,
  },
  "bahrain-gp": {
    circuit_info: { length: "5.412 km", turns: 15, lap_record: "1:31.447", lap_record_holder: "Pedro de la Rosa", lap_record_year: 2005, drs_zones: 3, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Bahrain Grand Prix?", volume: "$1.9M", market_url: "https://polymarket.com/event/f1-bahrain-gp-2026", updated: "10 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.26, color: "#27F4D2", change: +0.03 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.02 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.18, color: "#3671C6", change: +0.01 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.15, color: "#E80020", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.11, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.06 },
    ] },
    weather: [
      { day: "Friday", date: "10 Apr", condition: "Sunny", temp_hi: 32, temp_lo: 23, rain: 0, wind: "15 km/h NW", icon: "sunny" },
      { day: "Saturday", date: "11 Apr", condition: "Sunny", temp_hi: 33, temp_lo: 24, rain: 0, wind: "12 km/h NW", icon: "sunny" },
      { day: "Sunday", date: "12 Apr", condition: "Sunny", temp_hi: 34, temp_lo: 24, rain: 0, wind: "10 km/h N", icon: "sunny" },
    ],
    safety_car_rate: 50, avg_overtakes: 35,
  },
  "saudi-arabian-gp": {
    circuit_info: { length: "6.174 km", turns: 27, lap_record: "1:30.734", lap_record_holder: "Lewis Hamilton", lap_record_year: 2021, drs_zones: 3, overtake_mode_zones: 3, layout: "Street", direction: "Anti-clockwise" },
    polymarket: { question: "Who will win the 2026 Saudi Arabian Grand Prix?", volume: "$1.7M", market_url: "https://polymarket.com/event/f1-saudi-arabian-gp-2026", updated: "8 min ago", outcomes: [
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.24, color: "#3671C6", change: +0.03 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.01 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.18, color: "#27F4D2", change: +0.02 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.15, color: "#E80020", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.12, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.09, color: "#444", change: -0.06 },
    ] },
    weather: [
      { day: "Friday", date: "17 Apr", condition: "Sunny", temp_hi: 35, temp_lo: 25, rain: 0, wind: "12 km/h W", icon: "sunny" },
      { day: "Saturday", date: "18 Apr", condition: "Sunny", temp_hi: 36, temp_lo: 26, rain: 0, wind: "10 km/h NW", icon: "sunny" },
      { day: "Sunday", date: "19 Apr", condition: "Partly Cloudy", temp_hi: 34, temp_lo: 25, rain: 5, wind: "14 km/h W", icon: "partly-cloudy" },
    ],
    safety_car_rate: 70, avg_overtakes: 20,
  },
  "miami-gp": {
    circuit_info: { length: "5.412 km", turns: 19, lap_record: "1:29.708", lap_record_holder: "Max Verstappen", lap_record_year: 2023, drs_zones: 3, overtake_mode_zones: 4, layout: "Street/Temporary", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Miami Grand Prix?", volume: "$2.0M", market_url: "https://polymarket.com/event/f1-miami-gp-2026", updated: "8 min ago", outcomes: [
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.26, color: "#FF8000", change: +0.04 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.02 },
      { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.18, color: "#FF8000", change: +0.03 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.14, color: "#27F4D2", change: -0.01 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.12, color: "#3671C6", change: -0.03 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.05 },
    ] },
    weather: [
      { day: "Friday", date: "01 May", condition: "Partly Cloudy", temp_hi: 30, temp_lo: 22, rain: 25, wind: "16 km/h SE", icon: "partly-cloudy" },
      { day: "Saturday", date: "02 May", condition: "Thunderstorms", temp_hi: 28, temp_lo: 23, rain: 70, wind: "20 km/h S", icon: "cloudy" },
      { day: "Sunday", date: "03 May", condition: "Partly Cloudy", temp_hi: 31, temp_lo: 23, rain: 30, wind: "14 km/h SW", icon: "partly-cloudy" },
    ],
    safety_car_rate: 55, avg_overtakes: 27,
  },
  "canadian-gp": {
    circuit_info: { length: "4.361 km", turns: 14, lap_record: "1:13.078", lap_record_holder: "Valtteri Bottas", lap_record_year: 2019, drs_zones: 2, overtake_mode_zones: 3, layout: "Semi-Street", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Canadian Grand Prix?", volume: "$1.6M", market_url: "https://polymarket.com/event/f1-canadian-gp-2026", updated: "20 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.24, color: "#27F4D2", change: +0.02 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.21, color: "#3671C6", change: +0.03 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.19, color: "#27F4D2", change: +0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.16, color: "#FF8000", change: -0.01 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.12, color: "#E80020", change: -0.02 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.03 },
    ] },
    weather: [
      { day: "Friday", date: "22 May", condition: "Partly Cloudy", temp_hi: 22, temp_lo: 14, rain: 20, wind: "15 km/h W", icon: "partly-cloudy" },
      { day: "Saturday", date: "23 May", condition: "Overcast", temp_hi: 20, temp_lo: 13, rain: 35, wind: "18 km/h NW", icon: "cloudy" },
      { day: "Sunday", date: "24 May", condition: "Partly Cloudy", temp_hi: 23, temp_lo: 14, rain: 20, wind: "12 km/h NW", icon: "partly-cloudy" },
    ],
    safety_car_rate: 65, avg_overtakes: 31,
  },
  "monaco-gp": {
    circuit_info: { length: "3.337 km", turns: 19, lap_record: "1:12.909", lap_record_holder: "Rubens Barrichello", lap_record_year: 2004, drs_zones: 1, overtake_mode_zones: 1, layout: "Street", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Monaco Grand Prix?", volume: "$3.2M", market_url: "https://polymarket.com/event/f1-monaco-gp-2026", updated: "3 min ago", outcomes: [
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.30, color: "#E80020", change: +0.05 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.02 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.16, color: "#27F4D2", change: +0.01 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.14, color: "#3671C6", change: -0.02 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
    ] },
    weather: [
      { day: "Thursday", date: "05 Jun", condition: "Partly Cloudy", temp_hi: 21, temp_lo: 15, rain: 15, wind: "12 km/h E", icon: "partly-cloudy" },
      { day: "Saturday", date: "06 Jun", condition: "Sunny", temp_hi: 23, temp_lo: 16, rain: 5, wind: "8 km/h SE", icon: "sunny" },
      { day: "Sunday", date: "07 Jun", condition: "Sunny", temp_hi: 24, temp_lo: 16, rain: 5, wind: "7 km/h S", icon: "sunny" },
    ],
    safety_car_rate: 75, avg_overtakes: 8,
  },
  "spanish-gp": {
    circuit_info: { length: "4.657 km", turns: 14, lap_record: "1:16.330", lap_record_holder: "Max Verstappen", lap_record_year: 2023, drs_zones: 2, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Spanish Grand Prix?", volume: "$1.7M", market_url: "https://polymarket.com/event/f1-spanish-gp-2026", updated: "15 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.26, color: "#27F4D2", change: +0.01 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.03 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.18, color: "#3671C6", change: +0.02 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.11, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.07, color: "#444", change: -0.06 },
    ] },
    weather: [
      { day: "Friday", date: "12 Jun", condition: "Sunny", temp_hi: 24, temp_lo: 14, rain: 5, wind: "9 km/h NW", icon: "sunny" },
      { day: "Saturday", date: "13 Jun", condition: "Sunny", temp_hi: 26, temp_lo: 15, rain: 5, wind: "8 km/h W", icon: "sunny" },
      { day: "Sunday", date: "14 Jun", condition: "Partly Cloudy", temp_hi: 25, temp_lo: 15, rain: 10, wind: "10 km/h SW", icon: "partly-cloudy" },
    ],
    safety_car_rate: 30, avg_overtakes: 24,
  },
  "austrian-gp": {
    circuit_info: { length: "4.318 km", turns: 10, lap_record: "1:05.619", lap_record_holder: "Carlos Sainz", lap_record_year: 2020, drs_zones: 3, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Austrian Grand Prix?", volume: "$1.4M", market_url: "https://polymarket.com/event/f1-austrian-gp-2026", updated: "18 min ago", outcomes: [
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.28, color: "#3671C6", change: +0.05 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.01 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.18, color: "#27F4D2", change: +0.02 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.15, color: "#FF8000", change: +0.02 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.10, color: "#E80020", change: -0.03 },
      { name: "Field", code: "FLD", team: "Others", price: 0.07, color: "#444", change: -0.07 },
    ] },
    weather: [
      { day: "Friday", date: "26 Jun", condition: "Sunny", temp_hi: 27, temp_lo: 15, rain: 5, wind: "10 km/h NW", icon: "sunny" },
      { day: "Saturday", date: "27 Jun", condition: "Partly Cloudy", temp_hi: 25, temp_lo: 14, rain: 15, wind: "12 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "28 Jun", condition: "Thunderstorms", temp_hi: 22, temp_lo: 13, rain: 65, wind: "22 km/h SW", icon: "cloudy" },
    ],
    safety_car_rate: 40, avg_overtakes: 38,
  },
  "british-gp": {
    circuit_info: { length: "5.891 km", turns: 18, lap_record: "1:27.097", lap_record_holder: "Max Verstappen", lap_record_year: 2020, drs_zones: 2, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 British Grand Prix?", volume: "$2.8M", market_url: "https://polymarket.com/event/f1-british-gp-2026", updated: "7 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.30, color: "#27F4D2", change: +0.06 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.21, color: "#27F4D2", change: +0.02 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.19, color: "#FF8000", change: +0.04 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.14, color: "#3671C6", change: -0.02 },
      { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.06, color: "#444", change: -0.11 },
    ] },
    weather: [
      { day: "Friday", date: "03 Jul", condition: "Overcast", temp_hi: 19, temp_lo: 13, rain: 35, wind: "20 km/h SW", icon: "cloudy" },
      { day: "Saturday", date: "04 Jul", condition: "Partly Cloudy", temp_hi: 21, temp_lo: 13, rain: 20, wind: "16 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "05 Jul", condition: "Mostly Sunny", temp_hi: 23, temp_lo: 14, rain: 10, wind: "12 km/h NW", icon: "sunny" },
    ],
    safety_car_rate: 38, avg_overtakes: 33,
  },
  "belgian-gp": {
    circuit_info: { length: "7.004 km", turns: 19, lap_record: "1:46.286", lap_record_holder: "Valtteri Bottas", lap_record_year: 2018, drs_zones: 2, overtake_mode_zones: 3, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Belgian Grand Prix?", volume: "$1.9M", market_url: "https://polymarket.com/event/f1-belgian-gp-2026", updated: "11 min ago", outcomes: [
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.26, color: "#3671C6", change: +0.03 },
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.23, color: "#27F4D2", change: +0.02 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.17, color: "#27F4D2", change: +0.01 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.14, color: "#E80020", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.12, color: "#FF8000", change: +0.02 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
    ] },
    weather: [
      { day: "Friday", date: "17 Jul", condition: "Overcast", temp_hi: 18, temp_lo: 12, rain: 40, wind: "19 km/h SW", icon: "cloudy" },
      { day: "Saturday", date: "18 Jul", condition: "Partly Cloudy", temp_hi: 20, temp_lo: 12, rain: 25, wind: "15 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "19 Jul", condition: "Partly Cloudy", temp_hi: 22, temp_lo: 13, rain: 20, wind: "13 km/h NW", icon: "partly-cloudy" },
    ],
    safety_car_rate: 45, avg_overtakes: 41,
  },
  "hungarian-gp": {
    circuit_info: { length: "4.381 km", turns: 14, lap_record: "1:16.627", lap_record_holder: "Lewis Hamilton", lap_record_year: 2020, drs_zones: 2, overtake_mode_zones: 2, layout: "Permanent", direction: "Clockwise" },
    polymarket: { question: "Who will win the 2026 Hungarian Grand Prix?", volume: "$1.3M", market_url: "https://polymarket.com/event/f1-hungarian-gp-2026", updated: "25 min ago", outcomes: [
      { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.25, color: "#27F4D2", change: +0.02 },
      { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.21, color: "#27F4D2", change: +0.03 },
      { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.18, color: "#3671C6", change: +0.02 },
      { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.01 },
      { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.12, color: "#FF8000", change: +0.01 },
      { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
    ] },
    weather: [
      { day: "Friday", date: "24 Jul", condition: "Sunny", temp_hi: 33, temp_lo: 21, rain: 5, wind: "8 km/h E", icon: "sunny" },
      { day: "Saturday", date: "25 Jul", condition: "Sunny", temp_hi: 35, temp_lo: 22, rain: 5, wind: "7 km/h SE", icon: "sunny" },
      { day: "Sunday", date: "26 Jul", condition: "Partly Cloudy", temp_hi: 32, temp_lo: 21, rain: 10, wind: "10 km/h S", icon: "partly-cloudy" },
    ],
    safety_car_rate: 35, avg_overtakes: 16,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`;
}

function formatSessionDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return DAYS[d.getUTCDay()];
}

function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return "TBC";
  return timeStr.replace(":00Z", "").replace("Z", "");
}

function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSessions(race: any, hasSprint: boolean): Session[] {
  const sessions: Session[] = [];

  if (race.FirstPractice) {
    sessions.push({
      label: "FP1",
      day: formatSessionDay(race.FirstPractice.date),
      date: formatSessionDate(race.FirstPractice.date),
      time: formatTime(race.FirstPractice.time),
      utc: "UTC",
    });
  }

  if (hasSprint && race.SprintQualifying) {
    sessions.push({
      label: "Sprint Quali",
      day: formatSessionDay(race.SprintQualifying.date),
      date: formatSessionDate(race.SprintQualifying.date),
      time: formatTime(race.SprintQualifying.time),
      utc: "UTC",
    });
  }

  if (!hasSprint && race.SecondPractice) {
    sessions.push({
      label: "FP2",
      day: formatSessionDay(race.SecondPractice.date),
      date: formatSessionDate(race.SecondPractice.date),
      time: formatTime(race.SecondPractice.time),
      utc: "UTC",
    });
  }

  if (hasSprint && race.Sprint) {
    sessions.push({
      label: "Sprint",
      day: formatSessionDay(race.Sprint.date),
      date: formatSessionDate(race.Sprint.date),
      time: formatTime(race.Sprint.time),
      utc: "UTC",
    });
  }

  if (!hasSprint && race.ThirdPractice) {
    sessions.push({
      label: "FP3",
      day: formatSessionDay(race.ThirdPractice.date),
      date: formatSessionDate(race.ThirdPractice.date),
      time: formatTime(race.ThirdPractice.time),
      utc: "UTC",
    });
  }

  if (race.Qualifying) {
    sessions.push({
      label: "Qualifying",
      day: formatSessionDay(race.Qualifying.date),
      date: formatSessionDate(race.Qualifying.date),
      time: formatTime(race.Qualifying.time),
      utc: "UTC",
    });
  }

  if (race.date && race.time) {
    sessions.push({
      label: "Race",
      day: formatSessionDay(race.date),
      date: formatSessionDate(race.date),
      time: formatTime(race.time),
      utc: "UTC",
    });
  }

  return sessions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildResults(resultsData: any[]): ResultEntry[] {
  return resultsData.slice(0, 10).map((r) => {
    const name = `${r.Driver.givenName} ${r.Driver.familyName}`;
    const team = r.Constructor.name;
    let time: string | undefined;
    if (parseInt(r.position, 10) === 1) {
      time = r.Time?.time;
    } else {
      time = r.Time?.time;
    }
    return {
      pos: parseInt(r.position, 10),
      driver: name,
      code: r.Driver.code || r.Driver.familyName.slice(0, 3).toUpperCase(),
      team,
      color: getTeamColor(team),
      time,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildHistoricalWinners(races: any[]): Winner[] {
  return races
    .slice(-5)
    .reverse()
    .map((race) => {
      const result = race.Results?.[0];
      if (!result) return null;
      const team = result.Constructor.name;
      return {
        year: parseInt(race.season, 10),
        driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
        code: result.Driver.code || result.Driver.familyName.slice(0, 3).toUpperCase(),
        team,
        color: getTeamColor(team),
      };
    })
    .filter((w): w is Winner => w !== null);
}

// ── Main function ────────────────────────────────────────────────────────────

export async function getRaceDetailData(slug: string): Promise<RaceData | null> {
  try {
    // 1. Find the race in our list
    const raceList = await getRacesList();
    const raceItem = raceList.find((r) => r.slug === slug);
    if (!raceItem) return null;

    const { round } = raceItem;

    // 2. Fetch schedule, results (if completed), and circuit winners in parallel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scheduleData: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resultsData: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let circuitWinnersData: any = null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scheduleData = (await getSeasonSchedule(2026)) as any;
    } catch {
      // Schedule fetch failed — we'll use fallback data
    }

    // Find the matching race in the schedule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduleRaces = scheduleData?.MRData?.RaceTable?.Races || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergastRace = scheduleRaces.find((r: any) => parseInt(r.round, 10) === round);

    const circuitId = ergastRace?.Circuit?.circuitId;
    const hasSprint = !!raceItem.sprint;
    const isCompleted = !!raceItem.completed;

    // Fetch results and circuit winners in parallel
    const promises: Promise<void>[] = [];

    if (isCompleted) {
      promises.push(
        getRoundResults(2026, round)
          .then((data) => { resultsData = data; })
          .catch(() => { /* results unavailable */ })
      );
    }

    if (circuitId) {
      promises.push(
        getCircuitWinners(circuitId)
          .then((data) => { circuitWinnersData = data; })
          .catch(() => { /* circuit winners unavailable */ })
      );
    }

    await Promise.all(promises);

    // 3. Build sessions from Ergast schedule or fall back
    const sessions: Session[] = ergastRace
      ? buildSessions(ergastRace, hasSprint)
      : [];

    // 4. Build results if completed
    const results: ResultEntry[] | undefined = isCompleted && resultsData
      ? buildResults(resultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [])
      : undefined;

    // 5. Build historical winners from circuit data
    const historicalWinners: Winner[] = circuitWinnersData
      ? buildHistoricalWinners(circuitWinnersData?.MRData?.RaceTable?.Races || [])
      : [];

    // 6. Resolve country and flag
    const country = ergastRace?.Circuit?.Location?.country || "";
    const flag = COUNTRY_FLAGS[country] || "";

    // 7. Resolve circuit name
    const circuitName = ergastRace?.Circuit?.circuitName || raceItem.circuit;

    // 8. Resolve locality
    const locality = ergastRace?.Circuit?.Location?.locality || raceItem.circuit;

    // 9. Merge with static enrichment
    const staticData = STATIC_RACE_DATA[slug];

    // 10. Build the date display
    const raceDate = ergastRace?.date
      ? formatDisplayDate(ergastRace.date)
      : raceItem.date;

    // 11. Assemble the full RaceData
    const raceData: RaceData = {
      id: slug,
      name: raceItem.name,
      circuit: circuitName,
      country,
      flag,
      round,
      season: 2026,
      date: raceDate,
      sprint: hasSprint || undefined,
      completed: isCompleted || undefined,
      hero: { locality: `${locality}, ${country}` },
      sessions,
      circuit_info: staticData?.circuit_info ?? {
        length: "N/A", turns: 0, lap_record: "N/A", lap_record_holder: "N/A",
        lap_record_year: 0, drs_zones: 0, overtake_mode_zones: 0,
        layout: "N/A", direction: "N/A",
      },
      polymarket: staticData?.polymarket ?? {
        question: `Who will win the 2026 ${raceItem.name}?`,
        volume: "N/A", market_url: "", updated: "N/A", outcomes: [],
      },
      history: {
        safety_car_rate: staticData?.safety_car_rate ?? 0,
        avg_overtakes: staticData?.avg_overtakes ?? 0,
        last_winners: historicalWinners,
      },
      weather: staticData?.weather ?? [],
      results,
    };

    return raceData;
  } catch {
    // Final fallback — return null so the page can show a "not found" state
    return null;
  }
}
