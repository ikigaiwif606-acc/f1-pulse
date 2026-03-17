import { searchMarkets } from "@/lib/api/polymarket";
import { transformPolymarketResults } from "./transformers";
import type { MarketsData, ChampionshipOddsItem } from "@/types";

// ── Fallback data (synced with polymarket.com/sports/f1/props) ──
const FALLBACK_MARKETS: MarketsData = {
  championship: [
    {
      question: "F1 Drivers' Champion 2026",
      volume: "$31M", endDate: "Dec 6, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.60, color: "#27F4D2" },
        { name: "Kimi Antonelli", code: "ANT", price: 0.18, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.10, color: "#E80020" },
        { name: "Lando Norris", code: "NOR", price: 0.05, color: "#FF8000" },
        { name: "Max Verstappen", code: "VER", price: 0.03, color: "#3671C6" },
      ],
    },
    {
      question: "F1 Constructors' Champion 2026",
      volume: "$4M", endDate: "Dec 6, 2026",
      outcomes: [
        { name: "Mercedes", code: "MER", price: 0.80, color: "#27F4D2" },
        { name: "Ferrari", code: "FER", price: 0.16, color: "#E80020" },
        { name: "McLaren", code: "MCL", price: 0.03, color: "#FF8000" },
      ],
    },
  ],
  raceWinner: [
    {
      question: "Japanese Grand Prix: Driver Winner",
      volume: "$202K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.55, color: "#27F4D2" },
        { name: "Kimi Antonelli", code: "ANT", price: 0.21, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.08, color: "#E80020" },
        { name: "Max Verstappen", code: "VER", price: 0.06, color: "#3671C6" },
        { name: "Lando Norris", code: "NOR", price: 0.04, color: "#FF8000" },
      ],
    },
    {
      question: "Japanese Grand Prix: Driver Pole Position",
      volume: "$50K", endDate: "Mar 28, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.57, color: "#27F4D2" },
        { name: "Kimi Antonelli", code: "ANT", price: 0.22, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.08, color: "#E80020" },
        { name: "Max Verstappen", code: "VER", price: 0.05, color: "#3671C6" },
      ],
    },
    {
      question: "Japanese Grand Prix: Constructor Scores 1st",
      volume: "$30K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Red Bull", code: "RBR", price: 0.83, color: "#3671C6" },
        { name: "Mercedes", code: "MER", price: 0.73, color: "#27F4D2" },
        { name: "Ferrari", code: "FER", price: 0.50, color: "#E80020" },
        { name: "McLaren", code: "MCL", price: 0.30, color: "#FF8000" },
      ],
    },
  ],
  props: [
    {
      question: "Safety Car During Japanese Grand Prix 2026?",
      volume: "$40K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Yes", code: "YES", price: 0.67, color: "#f59e0b" },
        { name: "No", code: "NO", price: 0.33, color: "#666" },
      ],
    },
    {
      question: "Red Flag During Japanese Grand Prix 2026?",
      volume: "$25K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Yes", code: "YES", price: 0.33, color: "#E10600" },
        { name: "No", code: "NO", price: 0.67, color: "#666" },
      ],
    },
    {
      question: "Japanese Grand Prix: Driver Fastest Lap",
      volume: "$20K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Kimi Antonelli", code: "ANT", price: 0.65, color: "#27F4D2" },
        { name: "George Russell", code: "RUS", price: 0.44, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.15, color: "#E80020" },
      ],
    },
    {
      question: "Japanese Grand Prix: Constructor Fastest Lap",
      volume: "$15K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Williams", code: "WIL", price: 0.49, color: "#1868DB" },
        { name: "Racing Bulls", code: "RBU", price: 0.49, color: "#6692FF" },
        { name: "Mercedes", code: "MER", price: 0.80, color: "#27F4D2" },
      ],
    },
    {
      question: "Japanese Grand Prix: Practice 1 Fastest Lap",
      volume: "$10K", endDate: "Mar 26, 2026",
      outcomes: [
        { name: "Charles Leclerc", code: "LEC", price: 0.44, color: "#E80020" },
        { name: "Lando Norris", code: "NOR", price: 0.44, color: "#FF8000" },
        { name: "George Russell", code: "RUS", price: 0.30, color: "#27F4D2" },
      ],
    },
    {
      question: "F1: Action of the Year 2026",
      volume: "$180K", endDate: "Dec 31, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.21, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.05, color: "#E80020" },
        { name: "Max Verstappen", code: "VER", price: 0.05, color: "#3671C6" },
      ],
    },
    {
      question: "Japanese Grand Prix: Constructor Pole Position",
      volume: "$20K", endDate: "Mar 28, 2026",
      outcomes: [
        { name: "Mercedes", code: "MER", price: 0.88, color: "#27F4D2" },
        { name: "Red Bull", code: "RBR", price: 0.34, color: "#3671C6" },
        { name: "Ferrari", code: "FER", price: 0.25, color: "#E80020" },
      ],
    },
  ],
};

const FALLBACK_CHAMPIONSHIP_ODDS: ChampionshipOddsItem[] = [
  { name: "George Russell", code: "RUS", odds: 0.60, volume: "$31M", change: +0.03, color: "#27F4D2" },
  { name: "Kimi Antonelli", code: "ANT", odds: 0.18, volume: "$31M", change: +0.02, color: "#27F4D2" },
  { name: "Charles Leclerc", code: "LEC", odds: 0.10, volume: "$31M", change: -0.01, color: "#E80020" },
  { name: "Lando Norris", code: "NOR", odds: 0.05, volume: "$31M", change: -0.02, color: "#FF8000" },
  { name: "Max Verstappen", code: "VER", odds: 0.03, volume: "$31M", change: -0.03, color: "#3671C6" },
];

export async function getMarkets(category?: string): Promise<MarketsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (await searchMarkets("f1", 50)) as any[];
    const markets = transformPolymarketResults(raw);

    // Only return non-empty results
    if (
      markets.championship.length > 0 ||
      markets.raceWinner.length > 0 ||
      markets.props.length > 0
    ) {
      if (category && category in markets) {
        return {
          ...FALLBACK_MARKETS,
          [category]: markets[category as keyof MarketsData],
        };
      }
      return markets;
    }
    return FALLBACK_MARKETS;
  } catch {
    return FALLBACK_MARKETS;
  }
}

export async function getChampionshipOdds(): Promise<ChampionshipOddsItem[]> {
  try {
    const markets = await getMarkets("championship");
    const championshipMarket = markets.championship.find((m) =>
      m.question.toLowerCase().includes("drivers")
    );

    if (championshipMarket && championshipMarket.outcomes.length > 0) {
      return championshipMarket.outcomes.map((o) => ({
        name: o.name,
        code: o.code,
        odds: o.price,
        volume: "",
        change: 0, // Can't derive change from a single snapshot
        color: o.color,
      }));
    }
    return FALLBACK_CHAMPIONSHIP_ODDS;
  } catch {
    return FALLBACK_CHAMPIONSHIP_ODDS;
  }
}
