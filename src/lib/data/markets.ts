import { searchMarkets } from "@/lib/api/polymarket";
import { transformPolymarketResults } from "./transformers";
import type { MarketsData, ChampionshipOddsItem } from "@/types";

// ── Fallback data ──────────────────────────────────────────────
const FALLBACK_MARKETS: MarketsData = {
  championship: [
    {
      question: "Who will win the 2026 F1 Drivers' Championship?",
      volume: "$18.2M", endDate: "Dec 6, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.57, color: "#27F4D2" },
        { name: "Kimi Antonelli", code: "ANT", price: 0.15, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.10, color: "#E80020" },
        { name: "Lando Norris", code: "NOR", price: 0.08, color: "#FF8000" },
        { name: "Max Verstappen", code: "VER", price: 0.05, color: "#3671C6" },
      ],
    },
    {
      question: "Who will win the 2026 Constructors' Championship?",
      volume: "$12.1M", endDate: "Dec 6, 2026",
      outcomes: [
        { name: "Mercedes", code: "MER", price: 0.65, color: "#27F4D2" },
        { name: "Ferrari", code: "FER", price: 0.18, color: "#E80020" },
        { name: "McLaren", code: "MCL", price: 0.10, color: "#FF8000" },
      ],
    },
  ],
  raceWinner: [
    {
      question: "Who will win the 2026 Japanese Grand Prix?",
      volume: "$2.4M", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "George Russell", code: "RUS", price: 0.28, color: "#27F4D2" },
        { name: "Kimi Antonelli", code: "ANT", price: 0.22, color: "#27F4D2" },
        { name: "Charles Leclerc", code: "LEC", price: 0.15, color: "#E80020" },
        { name: "Max Verstappen", code: "VER", price: 0.12, color: "#3671C6" },
        { name: "Lando Norris", code: "NOR", price: 0.10, color: "#FF8000" },
      ],
    },
  ],
  props: [
    {
      question: "Will there be a safety car at the Japanese GP?",
      volume: "$340K", endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Yes", code: "YES", price: 0.35, color: "#f59e0b" },
        { name: "No", code: "NO", price: 0.65, color: "#666" },
      ],
    },
    {
      question: "F1 Action of the Year 2026 Award Winner?",
      volume: "$180K", endDate: "Dec 31, 2026",
      outcomes: [
        { name: "Max Verstappen", code: "VER", price: 0.20, color: "#3671C6" },
        { name: "Lewis Hamilton", code: "HAM", price: 0.18, color: "#E80020" },
        { name: "Fernando Alonso", code: "ALO", price: 0.12, color: "#229971" },
      ],
    },
  ],
};

const FALLBACK_CHAMPIONSHIP_ODDS: ChampionshipOddsItem[] = [
  { name: "George Russell", code: "RUS", odds: 0.57, volume: "$18.2M", change: +0.05, color: "#27F4D2" },
  { name: "Kimi Antonelli", code: "ANT", odds: 0.15, volume: "$8.4M", change: +0.03, color: "#27F4D2" },
  { name: "Charles Leclerc", code: "LEC", odds: 0.10, volume: "$6.1M", change: -0.02, color: "#E80020" },
  { name: "Lando Norris", code: "NOR", odds: 0.08, volume: "$5.7M", change: +0.01, color: "#FF8000" },
  { name: "Max Verstappen", code: "VER", odds: 0.05, volume: "$4.9M", change: -0.04, color: "#3671C6" },
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
