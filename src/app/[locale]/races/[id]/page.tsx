import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

type Session = {
  label: string;
  day: string;
  date: string;
  time: string;
  utc: string;
};

type Outcome = {
  name: string;
  code: string;
  team: string;
  price: number;
  color: string;
  change: number;
};

type Winner = {
  year: number;
  driver: string;
  code: string;
  team: string;
  color: string;
};

type WeatherDay = {
  day: string;
  date: string;
  condition: string;
  temp_hi: number;
  temp_lo: number;
  rain: number;
  wind: string;
  icon: string;
};

type ResultEntry = {
  pos: number;
  driver: string;
  code: string;
  team: string;
  color: string;
  time?: string;
};

type RaceData = {
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
  hero: {
    locality: string;
  };
  sessions: Session[];
  circuit_info: {
    length: string;
    turns: number;
    lap_record: string;
    lap_record_holder: string;
    lap_record_year: number;
    drs_zones: number;
    overtake_mode_zones: number;
    layout: string;
    direction: string;
  };
  polymarket: {
    question: string;
    volume: string;
    market_url: string;
    updated: string;
    outcomes: Outcome[];
  };
  history: {
    safety_car_rate: number;
    avg_overtakes: number;
    last_winners: Winner[];
  };
  weather: WeatherDay[];
  results?: ResultEntry[];
};

// ── Data ────────────────────────────────────────────────────────────────────

const RACES_DATA: Record<string, RaceData> = {
  "australian-gp": {
    id: "australian-gp",
    name: "Australian Grand Prix",
    circuit: "Albert Park Circuit",
    country: "Australia",
    flag: "🇦🇺",
    round: 1,
    season: 2026,
    date: "06 Mar 2026",
    completed: true,
    hero: {
      locality: "Melbourne, Victoria",
    },
    sessions: [
      { label: "FP1", day: "Thursday", date: "04 Mar", time: "01:30", utc: "UTC" },
      { label: "FP2", day: "Thursday", date: "04 Mar", time: "05:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "05 Mar", time: "01:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "05 Mar", time: "05:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "06 Mar", time: "04:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "5.278 km",
      turns: 16,
      lap_record: "1:20.235",
      lap_record_holder: "Charles Leclerc",
      lap_record_year: 2022,
      drs_zones: 4,
      overtake_mode_zones: 4,
      layout: "Street/Park",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Australian Grand Prix?",
      volume: "$1.8M",
      market_url: "https://polymarket.com/event/f1-australian-gp-2026",
      updated: "Race completed",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.38, color: "#27F4D2", change: +0.10 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.24, color: "#27F4D2", change: +0.06 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.04 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.10, color: "#3671C6", change: -0.03 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.08, color: "#FF8000", change: -0.02 },
        { name: "Field", code: "FLD", team: "Others", price: 0.04, color: "#444", change: -0.07 },
      ],
    },
    history: {
      safety_car_rate: 60,
      avg_overtakes: 22,
      last_winners: [
        { year: 2024, driver: "Carlos Sainz", code: "SAI", team: "Ferrari", color: "#E80020" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Charles Leclerc", code: "LEC", team: "Ferrari", color: "#E80020" },
        { year: 2019, driver: "Valtteri Bottas", code: "BOT", team: "Mercedes", color: "#27F4D2" },
        { year: 2018, driver: "Sebastian Vettel", code: "VET", team: "Ferrari", color: "#E80020" },
      ],
    },
    weather: [
      { day: "Thursday", date: "04 Mar", condition: "Partly Cloudy", temp_hi: 24, temp_lo: 16, rain: 15, wind: "14 km/h SW", icon: "partly-cloudy" },
      { day: "Saturday", date: "05 Mar", condition: "Mostly Sunny", temp_hi: 27, temp_lo: 17, rain: 5, wind: "10 km/h S", icon: "sunny" },
      { day: "Sunday", date: "06 Mar", condition: "Sunny", temp_hi: 28, temp_lo: 18, rain: 0, wind: "8 km/h SE", icon: "sunny" },
    ],
    results: [
      { pos: 1, driver: "George Russell", code: "RUS", team: "Mercedes", color: "#27F4D2", time: "1:29:45.211" },
      { pos: 2, driver: "Kimi Antonelli", code: "ANT", team: "Mercedes", color: "#27F4D2", time: "+4.876s" },
      { pos: 3, driver: "Charles Leclerc", code: "LEC", team: "Ferrari", color: "#E80020", time: "+12.340s" },
      { pos: 4, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6", time: "+21.007s" },
      { pos: 5, driver: "Lando Norris", code: "NOR", team: "McLaren", color: "#FF8000", time: "+28.553s" },
    ],
  },

  "chinese-gp": {
    id: "chinese-gp",
    name: "Chinese Grand Prix",
    circuit: "Shanghai International Circuit",
    country: "China",
    flag: "🇨🇳",
    round: 2,
    season: 2026,
    date: "13 Mar 2026",
    completed: true,
    hero: {
      locality: "Shanghai, Jiading District",
    },
    sessions: [
      { label: "FP1", day: "Thursday", date: "11 Mar", time: "03:30", utc: "UTC" },
      { label: "FP2", day: "Thursday", date: "11 Mar", time: "07:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "12 Mar", time: "03:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "12 Mar", time: "07:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "13 Mar", time: "07:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "5.451 km",
      turns: 16,
      lap_record: "1:32.238",
      lap_record_holder: "Michael Schumacher",
      lap_record_year: 2004,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Chinese Grand Prix?",
      volume: "$2.1M",
      market_url: "https://polymarket.com/event/f1-chinese-gp-2026",
      updated: "Race completed",
      outcomes: [
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.32, color: "#27F4D2", change: +0.08 },
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.25, color: "#27F4D2", change: -0.03 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.18, color: "#E80020", change: +0.02 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.11, color: "#3671C6", change: -0.02 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.09, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.05, color: "#444", change: -0.06 },
      ],
    },
    history: {
      safety_car_rate: 42,
      avg_overtakes: 34,
      last_winners: [
        { year: 2024, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2019, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2018, driver: "Daniel Ricciardo", code: "RIC", team: "Red Bull", color: "#3671C6" },
        { year: 2017, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Thursday", date: "11 Mar", condition: "Overcast", temp_hi: 13, temp_lo: 7, rain: 30, wind: "18 km/h NE", icon: "cloudy" },
      { day: "Saturday", date: "12 Mar", condition: "Partly Cloudy", temp_hi: 15, temp_lo: 8, rain: 20, wind: "14 km/h N", icon: "partly-cloudy" },
      { day: "Sunday", date: "13 Mar", condition: "Mostly Sunny", temp_hi: 17, temp_lo: 9, rain: 10, wind: "10 km/h NW", icon: "sunny" },
    ],
    results: [
      { pos: 1, driver: "Kimi Antonelli", code: "ANT", team: "Mercedes", color: "#27F4D2", time: "1:33:12.445" },
      { pos: 2, driver: "George Russell", code: "RUS", team: "Mercedes", color: "#27F4D2", time: "+3.221s" },
      { pos: 3, driver: "Charles Leclerc", code: "LEC", team: "Ferrari", color: "#E80020", time: "+9.874s" },
      { pos: 4, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6", time: "+18.332s" },
      { pos: 5, driver: "Oscar Piastri", code: "PIA", team: "McLaren", color: "#FF8000", time: "+25.110s" },
    ],
  },

  "japanese-gp": {
    id: "japanese-gp",
    name: "Japanese Grand Prix",
    circuit: "Suzuka International Racing Course",
    country: "Japan",
    flag: "🇯🇵",
    round: 3,
    season: 2026,
    date: "29 Mar 2026",
    hero: {
      locality: "Suzuka, Mie Prefecture",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "27 Mar", time: "03:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "27 Mar", time: "07:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "28 Mar", time: "03:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "28 Mar", time: "07:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "29 Mar", time: "06:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "5.807 km",
      turns: 18,
      lap_record: "1:30.983",
      lap_record_holder: "Lewis Hamilton",
      lap_record_year: 2019,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Figure-8",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Japanese Grand Prix?",
      volume: "$2.4M",
      market_url: "https://polymarket.com/event/f1-japanese-gp-2026",
      updated: "5 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.28, color: "#27F4D2", change: +0.03 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.05 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.15, color: "#E80020", change: -0.02 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.12, color: "#3671C6", change: -0.01 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.02 },
        { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.07, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.06, color: "#444", change: -0.08 },
      ],
    },
    history: {
      safety_car_rate: 35,
      avg_overtakes: 28,
      last_winners: [
        { year: 2024, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2019, driver: "Valtteri Bottas", code: "BOT", team: "Mercedes", color: "#27F4D2" },
        { year: 2018, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "27 Mar", condition: "Overcast", temp_hi: 14, temp_lo: 9, rain: 20, wind: "12 km/h NW", icon: "cloudy" },
      { day: "Saturday", date: "28 Mar", condition: "Partly Cloudy", temp_hi: 16, temp_lo: 10, rain: 10, wind: "8 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "29 Mar", condition: "Mostly Sunny", temp_hi: 17, temp_lo: 11, rain: 5, wind: "10 km/h SW", icon: "sunny" },
    ],
  },

  "emilia-romagna-gp": {
    id: "emilia-romagna-gp",
    name: "Emilia Romagna Grand Prix",
    circuit: "Autodromo Enzo e Dino Ferrari",
    country: "Italy",
    flag: "🇮🇹",
    round: 4,
    season: 2026,
    date: "12 Apr 2026",
    hero: {
      locality: "Imola, Emilia-Romagna",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "10 Apr", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "10 Apr", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "11 Apr", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "11 Apr", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "12 Apr", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "4.909 km",
      turns: 19,
      lap_record: "1:15.484",
      lap_record_holder: "Max Verstappen",
      lap_record_year: 2022,
      drs_zones: 2,
      overtake_mode_zones: 2,
      layout: "Permanent",
      direction: "Anti-clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Emilia Romagna Grand Prix?",
      volume: "$1.5M",
      market_url: "https://polymarket.com/event/f1-emilia-romagna-gp-2026",
      updated: "12 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.27, color: "#27F4D2", change: +0.02 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.24, color: "#27F4D2", change: +0.03 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.20, color: "#E80020", change: +0.04 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.13, color: "#3671C6", change: -0.02 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.09, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.07, color: "#444", change: -0.08 },
      ],
    },
    history: {
      safety_car_rate: 50,
      avg_overtakes: 19,
      last_winners: [
        { year: 2024, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2019, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "10 Apr", condition: "Partly Cloudy", temp_hi: 18, temp_lo: 10, rain: 20, wind: "11 km/h NE", icon: "partly-cloudy" },
      { day: "Saturday", date: "11 Apr", condition: "Mostly Sunny", temp_hi: 20, temp_lo: 11, rain: 10, wind: "9 km/h E", icon: "sunny" },
      { day: "Sunday", date: "12 Apr", condition: "Sunny", temp_hi: 22, temp_lo: 12, rain: 5, wind: "7 km/h SE", icon: "sunny" },
    ],
  },

  "miami-gp": {
    id: "miami-gp",
    name: "Miami Grand Prix",
    circuit: "Miami International Autodrome",
    country: "United States",
    flag: "🇺🇸",
    round: 5,
    season: 2026,
    date: "03 May 2026",
    sprint: true,
    hero: {
      locality: "Miami Gardens, Florida",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "01 May", time: "18:30", utc: "UTC" },
      { label: "Sprint Quali", day: "Friday", date: "01 May", time: "22:00", utc: "UTC" },
      { label: "Sprint", day: "Saturday", date: "02 May", time: "18:00", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "02 May", time: "22:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "03 May", time: "20:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "5.412 km",
      turns: 19,
      lap_record: "1:29.708",
      lap_record_holder: "Max Verstappen",
      lap_record_year: 2023,
      drs_zones: 3,
      overtake_mode_zones: 4,
      layout: "Street/Temporary",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Miami Grand Prix?",
      volume: "$2.0M",
      market_url: "https://polymarket.com/event/f1-miami-gp-2026",
      updated: "8 min ago",
      outcomes: [
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.26, color: "#FF8000", change: +0.04 },
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.02 },
        { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.18, color: "#FF8000", change: +0.03 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.14, color: "#27F4D2", change: -0.01 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.12, color: "#3671C6", change: -0.03 },
        { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.05 },
      ],
    },
    history: {
      safety_car_rate: 55,
      avg_overtakes: 27,
      last_winners: [
        { year: 2024, driver: "Lando Norris", code: "NOR", team: "McLaren", color: "#FF8000" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
      ],
    },
    weather: [
      { day: "Friday", date: "01 May", condition: "Partly Cloudy", temp_hi: 30, temp_lo: 22, rain: 25, wind: "16 km/h SE", icon: "partly-cloudy" },
      { day: "Saturday", date: "02 May", condition: "Thunderstorms", temp_hi: 28, temp_lo: 23, rain: 70, wind: "20 km/h S", icon: "cloudy" },
      { day: "Sunday", date: "03 May", condition: "Partly Cloudy", temp_hi: 31, temp_lo: 23, rain: 30, wind: "14 km/h SW", icon: "partly-cloudy" },
    ],
  },

  "spanish-gp": {
    id: "spanish-gp",
    name: "Spanish Grand Prix",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    flag: "🇪🇸",
    round: 6,
    season: 2026,
    date: "17 May 2026",
    hero: {
      locality: "Montmeló, Barcelona",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "15 May", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "15 May", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "16 May", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "16 May", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "17 May", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "4.657 km",
      turns: 14,
      lap_record: "1:16.330",
      lap_record_holder: "Max Verstappen",
      lap_record_year: 2023,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Spanish Grand Prix?",
      volume: "$1.7M",
      market_url: "https://polymarket.com/event/f1-spanish-gp-2026",
      updated: "15 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.26, color: "#27F4D2", change: +0.01 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.03 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.18, color: "#3671C6", change: +0.02 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.01 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.11, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.07, color: "#444", change: -0.06 },
      ],
    },
    history: {
      safety_car_rate: 30,
      avg_overtakes: 24,
      last_winners: [
        { year: 2024, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2021, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "15 May", condition: "Sunny", temp_hi: 24, temp_lo: 14, rain: 5, wind: "9 km/h NW", icon: "sunny" },
      { day: "Saturday", date: "16 May", condition: "Sunny", temp_hi: 26, temp_lo: 15, rain: 5, wind: "8 km/h W", icon: "sunny" },
      { day: "Sunday", date: "17 May", condition: "Partly Cloudy", temp_hi: 25, temp_lo: 15, rain: 10, wind: "10 km/h SW", icon: "partly-cloudy" },
    ],
  },

  "monaco-gp": {
    id: "monaco-gp",
    name: "Monaco Grand Prix",
    circuit: "Circuit de Monaco",
    country: "Monaco",
    flag: "🇲🇨",
    round: 7,
    season: 2026,
    date: "24 May 2026",
    hero: {
      locality: "Monte Carlo, Monaco",
    },
    sessions: [
      { label: "FP1", day: "Thursday", date: "21 May", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Thursday", date: "21 May", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "23 May", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "23 May", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "24 May", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "3.337 km",
      turns: 19,
      lap_record: "1:12.909",
      lap_record_holder: "Rubens Barrichello",
      lap_record_year: 2004,
      drs_zones: 1,
      overtake_mode_zones: 1,
      layout: "Street",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Monaco Grand Prix?",
      volume: "$3.2M",
      market_url: "https://polymarket.com/event/f1-monaco-gp-2026",
      updated: "3 min ago",
      outcomes: [
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.30, color: "#E80020", change: +0.05 },
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.02 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.16, color: "#27F4D2", change: +0.01 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.14, color: "#3671C6", change: -0.02 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
      ],
    },
    history: {
      safety_car_rate: 75,
      avg_overtakes: 8,
      last_winners: [
        { year: 2024, driver: "Charles Leclerc", code: "LEC", team: "Ferrari", color: "#E80020" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Sergio Pérez", code: "PER", team: "Red Bull", color: "#3671C6" },
        { year: 2021, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2019, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Thursday", date: "21 May", condition: "Partly Cloudy", temp_hi: 21, temp_lo: 15, rain: 15, wind: "12 km/h E", icon: "partly-cloudy" },
      { day: "Saturday", date: "23 May", condition: "Sunny", temp_hi: 23, temp_lo: 16, rain: 5, wind: "8 km/h SE", icon: "sunny" },
      { day: "Sunday", date: "24 May", condition: "Sunny", temp_hi: 24, temp_lo: 16, rain: 5, wind: "7 km/h S", icon: "sunny" },
    ],
  },

  "canadian-gp": {
    id: "canadian-gp",
    name: "Canadian Grand Prix",
    circuit: "Circuit Gilles Villeneuve",
    country: "Canada",
    flag: "🇨🇦",
    round: 8,
    season: 2026,
    date: "07 Jun 2026",
    hero: {
      locality: "Montreal, Quebec",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "05 Jun", time: "17:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "05 Jun", time: "21:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "06 Jun", time: "16:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "06 Jun", time: "20:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "07 Jun", time: "18:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "4.361 km",
      turns: 14,
      lap_record: "1:13.078",
      lap_record_holder: "Valtteri Bottas",
      lap_record_year: 2019,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Semi-Street",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Canadian Grand Prix?",
      volume: "$1.6M",
      market_url: "https://polymarket.com/event/f1-canadian-gp-2026",
      updated: "20 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.24, color: "#27F4D2", change: +0.02 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.21, color: "#3671C6", change: +0.03 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.19, color: "#27F4D2", change: +0.01 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.16, color: "#FF8000", change: -0.01 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.12, color: "#E80020", change: -0.02 },
        { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.03 },
      ],
    },
    history: {
      safety_car_rate: 65,
      avg_overtakes: 31,
      last_winners: [
        { year: 2024, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2019, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2018, driver: "Sebastian Vettel", code: "VET", team: "Ferrari", color: "#E80020" },
      ],
    },
    weather: [
      { day: "Friday", date: "05 Jun", condition: "Partly Cloudy", temp_hi: 22, temp_lo: 14, rain: 20, wind: "15 km/h W", icon: "partly-cloudy" },
      { day: "Saturday", date: "06 Jun", condition: "Overcast", temp_hi: 20, temp_lo: 13, rain: 35, wind: "18 km/h NW", icon: "cloudy" },
      { day: "Sunday", date: "07 Jun", condition: "Partly Cloudy", temp_hi: 23, temp_lo: 14, rain: 20, wind: "12 km/h NW", icon: "partly-cloudy" },
    ],
  },

  "austrian-gp": {
    id: "austrian-gp",
    name: "Austrian Grand Prix",
    circuit: "Red Bull Ring",
    country: "Austria",
    flag: "🇦🇹",
    round: 9,
    season: 2026,
    date: "21 Jun 2026",
    sprint: true,
    hero: {
      locality: "Spielberg, Styria",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "19 Jun", time: "11:30", utc: "UTC" },
      { label: "Sprint Quali", day: "Friday", date: "19 Jun", time: "15:00", utc: "UTC" },
      { label: "Sprint", day: "Saturday", date: "20 Jun", time: "11:00", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "20 Jun", time: "15:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "21 Jun", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "4.318 km",
      turns: 10,
      lap_record: "1:05.619",
      lap_record_holder: "Carlos Sainz",
      lap_record_year: 2020,
      drs_zones: 3,
      overtake_mode_zones: 3,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Austrian Grand Prix?",
      volume: "$1.4M",
      market_url: "https://polymarket.com/event/f1-austrian-gp-2026",
      updated: "18 min ago",
      outcomes: [
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.28, color: "#3671C6", change: +0.05 },
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.22, color: "#27F4D2", change: +0.01 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.18, color: "#27F4D2", change: +0.02 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.15, color: "#FF8000", change: +0.02 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.10, color: "#E80020", change: -0.03 },
        { name: "Field", code: "FLD", team: "Others", price: 0.07, color: "#444", change: -0.07 },
      ],
    },
    history: {
      safety_car_rate: 40,
      avg_overtakes: 38,
      last_winners: [
        { year: 2024, driver: "George Russell", code: "RUS", team: "Mercedes", color: "#27F4D2" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Charles Leclerc", code: "LEC", team: "Ferrari", color: "#E80020" },
        { year: 2021, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "19 Jun", condition: "Sunny", temp_hi: 27, temp_lo: 15, rain: 5, wind: "10 km/h NW", icon: "sunny" },
      { day: "Saturday", date: "20 Jun", condition: "Partly Cloudy", temp_hi: 25, temp_lo: 14, rain: 15, wind: "12 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "21 Jun", condition: "Thunderstorms", temp_hi: 22, temp_lo: 13, rain: 65, wind: "22 km/h SW", icon: "cloudy" },
    ],
  },

  "british-gp": {
    id: "british-gp",
    name: "British Grand Prix",
    circuit: "Silverstone Circuit",
    country: "United Kingdom",
    flag: "🇬🇧",
    round: 10,
    season: 2026,
    date: "05 Jul 2026",
    hero: {
      locality: "Silverstone, Northamptonshire",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "03 Jul", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "03 Jul", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "04 Jul", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "04 Jul", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "05 Jul", time: "14:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "5.891 km",
      turns: 18,
      lap_record: "1:27.097",
      lap_record_holder: "Max Verstappen",
      lap_record_year: 2020,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 British Grand Prix?",
      volume: "$2.8M",
      market_url: "https://polymarket.com/event/f1-british-gp-2026",
      updated: "7 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.30, color: "#27F4D2", change: +0.06 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.21, color: "#27F4D2", change: +0.02 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.19, color: "#FF8000", change: +0.04 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.14, color: "#3671C6", change: -0.02 },
        { name: "Oscar Piastri", code: "PIA", team: "McLaren", price: 0.10, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.06, color: "#444", change: -0.11 },
      ],
    },
    history: {
      safety_car_rate: 38,
      avg_overtakes: 33,
      last_winners: [
        { year: 2024, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Carlos Sainz", code: "SAI", team: "Ferrari", color: "#E80020" },
        { year: 2021, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "03 Jul", condition: "Overcast", temp_hi: 19, temp_lo: 13, rain: 35, wind: "20 km/h SW", icon: "cloudy" },
      { day: "Saturday", date: "04 Jul", condition: "Partly Cloudy", temp_hi: 21, temp_lo: 13, rain: 20, wind: "16 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "05 Jul", condition: "Mostly Sunny", temp_hi: 23, temp_lo: 14, rain: 10, wind: "12 km/h NW", icon: "sunny" },
    ],
  },

  "belgian-gp": {
    id: "belgian-gp",
    name: "Belgian Grand Prix",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    flag: "🇧🇪",
    round: 11,
    season: 2026,
    date: "19 Jul 2026",
    hero: {
      locality: "Stavelot, Liège Province",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "17 Jul", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "17 Jul", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "18 Jul", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "18 Jul", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "19 Jul", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "7.004 km",
      turns: 19,
      lap_record: "1:46.286",
      lap_record_holder: "Valtteri Bottas",
      lap_record_year: 2018,
      drs_zones: 2,
      overtake_mode_zones: 3,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Belgian Grand Prix?",
      volume: "$1.9M",
      market_url: "https://polymarket.com/event/f1-belgian-gp-2026",
      updated: "11 min ago",
      outcomes: [
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.26, color: "#3671C6", change: +0.03 },
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.23, color: "#27F4D2", change: +0.02 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.17, color: "#27F4D2", change: +0.01 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.14, color: "#E80020", change: -0.01 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.12, color: "#FF8000", change: +0.02 },
        { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
      ],
    },
    history: {
      safety_car_rate: 45,
      avg_overtakes: 41,
      last_winners: [
        { year: 2024, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Carlos Sainz", code: "SAI", team: "Ferrari", color: "#E80020" },
        { year: 2021, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "17 Jul", condition: "Overcast", temp_hi: 18, temp_lo: 12, rain: 40, wind: "19 km/h SW", icon: "cloudy" },
      { day: "Saturday", date: "18 Jul", condition: "Partly Cloudy", temp_hi: 20, temp_lo: 12, rain: 25, wind: "15 km/h W", icon: "partly-cloudy" },
      { day: "Sunday", date: "19 Jul", condition: "Partly Cloudy", temp_hi: 22, temp_lo: 13, rain: 20, wind: "13 km/h NW", icon: "partly-cloudy" },
    ],
  },

  "hungarian-gp": {
    id: "hungarian-gp",
    name: "Hungarian Grand Prix",
    circuit: "Hungaroring",
    country: "Hungary",
    flag: "🇭🇺",
    round: 12,
    season: 2026,
    date: "02 Aug 2026",
    hero: {
      locality: "Mogyoród, Budapest",
    },
    sessions: [
      { label: "FP1", day: "Friday", date: "31 Jul", time: "11:30", utc: "UTC" },
      { label: "FP2", day: "Friday", date: "31 Jul", time: "15:00", utc: "UTC" },
      { label: "FP3", day: "Saturday", date: "01 Aug", time: "10:30", utc: "UTC" },
      { label: "Qualifying", day: "Saturday", date: "01 Aug", time: "14:00", utc: "UTC" },
      { label: "Race", day: "Sunday", date: "02 Aug", time: "13:00", utc: "UTC" },
    ],
    circuit_info: {
      length: "4.381 km",
      turns: 14,
      lap_record: "1:16.627",
      lap_record_holder: "Lewis Hamilton",
      lap_record_year: 2020,
      drs_zones: 2,
      overtake_mode_zones: 2,
      layout: "Permanent",
      direction: "Clockwise",
    },
    polymarket: {
      question: "Who will win the 2026 Hungarian Grand Prix?",
      volume: "$1.3M",
      market_url: "https://polymarket.com/event/f1-hungarian-gp-2026",
      updated: "25 min ago",
      outcomes: [
        { name: "George Russell", code: "RUS", team: "Mercedes", price: 0.25, color: "#27F4D2", change: +0.02 },
        { name: "Kimi Antonelli", code: "ANT", team: "Mercedes", price: 0.21, color: "#27F4D2", change: +0.03 },
        { name: "Max Verstappen", code: "VER", team: "Red Bull", price: 0.18, color: "#3671C6", change: +0.02 },
        { name: "Charles Leclerc", code: "LEC", team: "Ferrari", price: 0.16, color: "#E80020", change: -0.01 },
        { name: "Lando Norris", code: "NOR", team: "McLaren", price: 0.12, color: "#FF8000", change: +0.01 },
        { name: "Field", code: "FLD", team: "Others", price: 0.08, color: "#444", change: -0.07 },
      ],
    },
    history: {
      safety_car_rate: 35,
      avg_overtakes: 16,
      last_winners: [
        { year: 2024, driver: "Oscar Piastri", code: "PIA", team: "McLaren", color: "#FF8000" },
        { year: 2023, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2022, driver: "Max Verstappen", code: "VER", team: "Red Bull", color: "#3671C6" },
        { year: 2021, driver: "Esteban Ocon", code: "OCO", team: "Alpine", color: "#0090FF" },
        { year: 2020, driver: "Lewis Hamilton", code: "HAM", team: "Mercedes", color: "#27F4D2" },
      ],
    },
    weather: [
      { day: "Friday", date: "31 Jul", condition: "Sunny", temp_hi: 33, temp_lo: 21, rain: 5, wind: "8 km/h E", icon: "sunny" },
      { day: "Saturday", date: "01 Aug", condition: "Sunny", temp_hi: 35, temp_lo: 22, rain: 5, wind: "7 km/h SE", icon: "sunny" },
      { day: "Sunday", date: "02 Aug", condition: "Partly Cloudy", temp_hi: 32, temp_lo: 21, rain: 10, wind: "10 km/h S", icon: "partly-cloudy" },
    ],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function WeatherIcon({ type }: { type: string }) {
  if (type === "sunny") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#f59e0b]">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  if (type === "partly-cloudy") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#94a3b8]">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748b]">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function RainBar({ pct }: { pct: number }) {
  const color = pct >= 60 ? "#3b82f6" : pct >= 30 ? "#60a5fa" : "#1e3a5f";
  return (
    <div className="mt-1 h-[3px] w-full rounded-full bg-[#161616]">
      <div className="h-[3px] rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const race = RACES_DATA[id] ?? null;

  if (!race) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="f1-heading text-white mb-2">Race not found</p>
          <Link href="/races" className="f1-label !text-[#E10600]">Back to Calendar</Link>
        </div>
      </div>
    );
  }

  return <RaceDetailContent race={race} />;
}

// Split into a client-safe component so we can use hooks
function RaceDetailContent({ race }: { race: RaceData }) {
  return <RaceDetailInner race={race} />;
}

function RaceDetailInner({ race }: { race: RaceData }) {
  const t = useTranslations("race");
  const tMarkets = useTranslations("markets");

  const raceSession = race.sessions.find((s) => s.label === "Race");
  const qualSession = race.sessions.find((s) => s.label === "Qualifying");

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Back Navigation ─────────────────────────────────────────────── */}
      <div className="border-b border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-3">
          <Link
            href="/races"
            className="f1-transition f1-label inline-flex items-center gap-2 hover:!text-white"
          >
            <span style={{ color: "#444" }}>&#8592;</span>
            <span>Back to Calendar</span>
          </Link>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-24 left-1/3 h-48 w-[400px] -translate-x-1/2 rounded-full bg-[#E10600]/5 blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Left: race identity */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {/* Round badge */}
                <span className="f1-label rounded bg-[#E10600] px-2 py-0.5 !text-white">
                  Round {race.round}
                </span>
                {/* Season */}
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2 py-0.5">
                  {race.season} Season
                </span>
                {/* Live/upcoming indicator */}
                {race.completed ? (
                  <span className="f1-label flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2 py-0.5 !text-[#555]">
                    Completed
                  </span>
                ) : (
                  <span className="f1-label flex items-center gap-1.5 rounded border border-[#E10600]/20 bg-[#E10600]/[0.04] px-2 py-0.5 !text-[#E10600]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
                    Upcoming
                  </span>
                )}
                {race.sprint && (
                  <span className="f1-label rounded border border-[#E10600]/20 bg-[#E10600]/10 px-2 py-0.5 !text-[#E10600]">
                    Sprint
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-4xl leading-none">{race.flag}</span>
                <div>
                  <h1 className="f1-display-xl text-white">{race.name}</h1>
                  <p className="f1-body-sm mt-1" style={{ color: "#555" }}>
                    {race.circuit}
                  </p>
                  <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                    {race.hero.locality} &middot; {race.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: date + key session times */}
            <div className="shrink-0 space-y-2">
              <div className="flex items-center justify-end gap-2">
                <span className="f1-label-xs">Race Date</span>
                <span className="f1-data text-sm text-white">{race.date}</span>
              </div>
              {raceSession && (
                <div className="flex items-center justify-end gap-2">
                  <span className="f1-label-xs">Race Start</span>
                  <span className="f1-data text-sm" style={{ color: "#E10600" }}>
                    {raceSession.time} {raceSession.utc}
                  </span>
                </div>
              )}
              {qualSession && (
                <div className="flex items-center justify-end gap-2">
                  <span className="f1-label-xs">Qualifying</span>
                  <span className="f1-data text-sm text-[#666]">
                    {qualSession.time} {qualSession.utc} SAT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-3">

          {/* ── LEFT / MAIN COLUMN (2/3) ────────────────────────────────── */}
          <div className="space-y-5 lg:col-span-2">

            {/* Race Results (completed races only) */}
            {race.completed && race.results && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">Race Result</span>
                </div>
                <div className="space-y-1">
                  {race.results.map((r) => (
                    <div
                      key={r.pos}
                      className="flex items-center gap-3 f1-surface-inner p-2.5"
                    >
                      <span className="f1-data w-5 shrink-0 text-center text-xs" style={{ color: r.pos === 1 ? "#f59e0b" : "#333" }}>
                        {r.pos}
                      </span>
                      <div className="f1-team-bar h-5" style={{ backgroundColor: r.color }} />
                      <span className="f1-body-sm flex-1 font-semibold text-white">{r.driver}</span>
                      <span className="f1-data text-xs" style={{ color: "#444" }}>{r.team}</span>
                      <span className="f1-data w-8 text-right text-xs font-bold" style={{ color: r.color }}>{r.code}</span>
                      {r.time && (
                        <span className="f1-data hidden w-24 text-right text-xs text-[#555] sm:block">{r.time}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Schedule */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("sessions")}</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-5">
                {race.sessions.map((session) => {
                  const isRace = session.label === "Race";
                  const isQual = session.label === "Qualifying";
                  return (
                    <div
                      key={session.label}
                      className={`f1-transition rounded border p-3 ${
                        isRace
                          ? "border-[#E10600]/25 bg-[#E10600]/[0.04]"
                          : isQual
                          ? "border-[#2a2a2a] bg-[#0f0f0f]"
                          : "border-[#1c1c1c] bg-[#0a0a0a]"
                      }`}
                    >
                      <p
                        className={`f1-label-xs ${isRace ? "!text-[#E10600]" : isQual ? "!text-[#999]" : ""}`}
                      >
                        {session.label}
                      </p>
                      <p className="f1-data mt-1.5 text-xs text-[#666]">{session.day}</p>
                      <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                        {session.date}
                      </p>
                      <p
                        className={`f1-data mt-1.5 text-sm ${
                          isRace ? "text-white" : "text-[#555]"
                        }`}
                      >
                        {session.time}
                        <span className="f1-label-xs ml-1">{session.utc}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Polymarket Odds */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("polymarketOdds")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                    <span className="f1-label-xs">Vol</span>
                    <span className="f1-data text-xs text-white">{race.polymarket.volume}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-live" />
                    <span className="f1-label-xs !text-emerald-500">Live</span>
                  </div>
                </div>
              </div>

              <p className="f1-body-sm mb-4" style={{ color: "#555" }}>
                {race.polymarket.question}
              </p>

              <div className="space-y-1">
                {race.polymarket.outcomes.map((o, i) => (
                  <div
                    key={o.name}
                    className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]"
                  >
                    {/* Rank */}
                    <span className="f1-data w-4 shrink-0 text-center text-xs" style={{ color: "#333" }}>
                      {i + 1}
                    </span>

                    {/* Team color bar */}
                    <div className="f1-team-bar h-6" style={{ backgroundColor: o.color }} />

                    {/* Driver info */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="f1-data w-7 shrink-0 text-[0.625rem]" style={{ color: "#444" }}>
                        {o.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="f1-body-sm block truncate font-semibold text-white">
                          {o.name}
                        </span>
                        <span className="f1-label-xs block" style={{ color: "#333" }}>
                          {o.team}
                        </span>
                      </div>
                    </div>

                    {/* Probability bar — hidden on small screens */}
                    <div className="hidden w-28 sm:block">
                      <div className="h-[3px] w-full rounded-full bg-[#161616]">
                        <div
                          className="h-[3px] rounded-full f1-transition"
                          style={{ width: `${o.price * 100}%`, backgroundColor: o.color }}
                        />
                      </div>
                    </div>

                    {/* Change indicator */}
                    <span
                      className={`f1-data hidden w-10 text-right text-xs sm:block ${
                        o.change > 0 ? "text-emerald-400" : o.change < 0 ? "text-[#E10600]" : "text-[#444]"
                      }`}
                    >
                      {o.change > 0 ? "+" : ""}
                      {(o.change * 100).toFixed(0)}%
                    </span>

                    {/* Price chip */}
                    <div className="w-14 shrink-0 rounded border border-[#1c1c1c] bg-[#0f0f0f] py-1 text-center">
                      <span className="f1-data text-sm text-white">
                        {(o.price * 100).toFixed(0)}
                      </span>
                      <span className="f1-label-xs ml-px">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#131313] pt-3">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  {tMarkets("lastUpdated")}: {race.polymarket.updated}
                </span>
                <a
                  href={race.polymarket.market_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                >
                  {tMarkets("betOn")} &rarr;
                </a>
              </div>
            </div>

            {/* Historical Data */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("history")}</span>
              </div>

              {/* Stat tiles */}
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="f1-surface-inner p-4 text-center">
                  <p className="f1-label-xs mb-2">Safety Car Rate</p>
                  <div>
                    <span className="f1-data-lg text-[#f59e0b]">
                      {race.history.safety_car_rate}
                    </span>
                    <span className="f1-label ml-1">%</span>
                  </div>
                  <p className="f1-body-sm mt-1" style={{ color: "#444" }}>
                    of all Suzuka GPs
                  </p>
                </div>

                <div className="f1-surface-inner p-4 text-center">
                  <p className="f1-label-xs mb-2">Avg. Overtakes</p>
                  <div>
                    <span className="f1-data-lg text-white">{race.history.avg_overtakes}</span>
                  </div>
                  <p className="f1-body-sm mt-1" style={{ color: "#444" }}>
                    per race (2021–24)
                  </p>
                </div>

                <div className="col-span-2 f1-surface-inner p-4 sm:col-span-1">
                  <p className="f1-label-xs mb-2">Lap Record</p>
                  <p className="f1-data text-sm text-white">{race.circuit_info.lap_record}</p>
                  <p className="f1-body-sm mt-0.5" style={{ color: "#555" }}>
                    {race.circuit_info.lap_record_holder}
                  </p>
                  <p className="f1-label mt-0.5" style={{ color: "#333" }}>
                    {race.circuit_info.lap_record_year}
                  </p>
                </div>
              </div>

              {/* Last 5 winners */}
              <div>
                <p className="f1-label mb-3" style={{ color: "#555" }}>
                  Last {race.history.last_winners.length} Winners at {race.circuit.split(" ")[0] === "Circuit" ? race.circuit.split(/Circuit\s+(?:de\s+|di\s+)?/i)[1] ?? race.circuit : race.circuit.split(" ").slice(0, 2).join(" ")}
                </p>
                <div className="space-y-1.5">
                  {race.history.last_winners.map((w) => (
                    <div
                      key={w.year}
                      className="flex items-center gap-3 f1-surface-inner p-2.5"
                    >
                      <span
                        className="f1-data w-9 shrink-0 text-center text-xs"
                        style={{ color: "#333" }}
                      >
                        {w.year}
                      </span>
                      <div className="f1-team-bar h-4" style={{ backgroundColor: w.color }} />
                      <span className="f1-body-sm flex-1 font-semibold text-white">
                        {w.driver}
                      </span>
                      <span
                        className="f1-data text-xs"
                        style={{ color: "#444" }}
                      >
                        {w.team}
                      </span>
                      <span
                        className="f1-data w-8 text-right text-xs font-bold"
                        style={{ color: w.color }}
                      >
                        {w.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (1/3) ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Circuit Information */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("circuit")}</span>
              </div>

              <div className="space-y-px">
                {[
                  { label: "Track Length", value: race.circuit_info.length },
                  { label: "Number of Turns", value: String(race.circuit_info.turns) },
                  { label: "Layout", value: race.circuit_info.layout },
                  { label: "Direction", value: race.circuit_info.direction },
                  { label: "Lap Record", value: race.circuit_info.lap_record },
                  { label: "Record Holder", value: race.circuit_info.lap_record_holder },
                  { label: "Record Year", value: String(race.circuit_info.lap_record_year) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between f1-surface-inner px-3 py-2.5"
                  >
                    <span className="f1-label" style={{ color: "#555" }}>
                      {row.label}
                    </span>
                    <span className="f1-data text-sm text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* DRS / Overtake Mode Zones */}
              <div className="mt-4 rounded border border-[#1c1c1c] bg-[#0a0a0a] p-3">
                <p className="f1-label mb-3" style={{ color: "#555" }}>
                  2026 Overtake Mode Zones
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="f1-data-lg text-[#E10600]">
                      {race.circuit_info.overtake_mode_zones}
                    </p>
                    <p className="f1-label-xs mt-0.5">Zones</p>
                  </div>
                  <div className="flex-1 border-l border-[#1c1c1c] pl-4">
                    <p className="f1-body-sm" style={{ color: "#555" }}>
                      Active overtake windows replacing legacy DRS system under 2026 regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("weather")}</span>
              </div>

              <div className="space-y-2">
                {race.weather.map((day) => {
                  const isRaceDay = day.day === "Sunday";
                  return (
                    <div
                      key={day.day}
                      className={`rounded border p-3 ${
                        isRaceDay
                          ? "border-[#E10600]/20 bg-[#E10600]/[0.03]"
                          : "border-[#1c1c1c] bg-[#0a0a0a]"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p
                            className={`f1-label-xs ${isRaceDay ? "!text-[#E10600]" : ""}`}
                          >
                            {day.day}
                          </p>
                          <p className="f1-label mt-0.5" style={{ color: "#333" }}>
                            {day.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <WeatherIcon type={day.icon} />
                          <span className="f1-body-sm" style={{ color: "#666" }}>
                            {day.condition}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Temperature */}
                        <div className="f1-surface-inner p-2 text-center">
                          <p className="f1-label-xs">Hi / Lo</p>
                          <p className="f1-data mt-1 text-xs text-white">
                            {day.temp_hi}°
                            <span style={{ color: "#444" }}>/{day.temp_lo}°</span>
                          </p>
                        </div>

                        {/* Rain */}
                        <div className="f1-surface-inner p-2 text-center">
                          <p className="f1-label-xs">Rain</p>
                          <p
                            className={`f1-data mt-1 text-xs ${
                              day.rain >= 60
                                ? "text-blue-400"
                                : day.rain >= 30
                                ? "text-blue-500/70"
                                : "text-[#444]"
                            }`}
                          >
                            {day.rain}%
                          </p>
                          <RainBar pct={day.rain} />
                        </div>

                        {/* Wind */}
                        <div className="f1-surface-inner p-2 text-center">
                          <p className="f1-label-xs">Wind</p>
                          <p className="f1-data mt-1 text-[0.625rem] text-[#555]">
                            {day.wind}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="f1-label-xs mt-3" style={{ color: "#2a2a2a" }}>
                Forecast updated 6h before each session
              </p>
            </div>

            {/* Quick links / betting CTA */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Betting Intel</span>
              </div>

              <div className="space-y-2">
                <a
                  href={race.polymarket.market_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]"
                >
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Race Winner</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                      Vol {race.polymarket.volume}
                    </p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>

                <a
                  href="https://polymarket.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]"
                >
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Safety Car?</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                      Vol $340K
                    </p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>

                <a
                  href="https://polymarket.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]"
                >
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Fastest Lap</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                      Vol $210K
                    </p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>
              </div>

              <div className="mt-4 border-t border-[#131313] pt-3">
                <Link
                  href="/markets"
                  className="f1-transition f1-label block text-center !text-[#E10600] hover:opacity-70"
                >
                  View all F1 markets &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
