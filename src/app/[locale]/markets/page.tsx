import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MARKETS = {
  championship: [
    {
      question: "Who will win the 2026 F1 Drivers' Championship?",
      volume: "$18.2M",
      endDate: "Dec 6, 2026",
      outcomes: [
        { name: "George Russell", price: 0.57, color: "#27F4D2" },
        { name: "Kimi Antonelli", price: 0.15, color: "#27F4D2" },
        { name: "Charles Leclerc", price: 0.10, color: "#E80020" },
        { name: "Lando Norris", price: 0.08, color: "#FF8000" },
        { name: "Max Verstappen", price: 0.05, color: "#3671C6" },
      ],
    },
    {
      question: "Who will win the 2026 Constructors' Championship?",
      volume: "$12.1M",
      endDate: "Dec 6, 2026",
      outcomes: [
        { name: "Mercedes", price: 0.65, color: "#27F4D2" },
        { name: "Ferrari", price: 0.18, color: "#E80020" },
        { name: "McLaren", price: 0.10, color: "#FF8000" },
      ],
    },
  ],
  raceWinner: [
    {
      question: "Who will win the 2026 Japanese Grand Prix?",
      volume: "$2.4M",
      endDate: "Mar 29, 2026",
      outcomes: [
        { name: "George Russell", price: 0.28, color: "#27F4D2" },
        { name: "Kimi Antonelli", price: 0.22, color: "#27F4D2" },
        { name: "Charles Leclerc", price: 0.15, color: "#E80020" },
        { name: "Max Verstappen", price: 0.12, color: "#3671C6" },
        { name: "Lando Norris", price: 0.10, color: "#FF8000" },
      ],
    },
  ],
  props: [
    {
      question: "Will there be a safety car at the Japanese GP?",
      volume: "$340K",
      endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Yes", price: 0.35, color: "#f59e0b" },
        { name: "No", price: 0.65, color: "#6b7280" },
      ],
    },
    {
      question: "F1 Action of the Year 2026 Award Winner?",
      volume: "$180K",
      endDate: "Dec 31, 2026",
      outcomes: [
        { name: "Max Verstappen", price: 0.20, color: "#3671C6" },
        { name: "Lewis Hamilton", price: 0.18, color: "#E80020" },
        { name: "Fernando Alonso", price: 0.12, color: "#229971" },
      ],
    },
  ],
};

export default function MarketsPage() {
  const t = useTranslations("markets");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Live odds from Polymarket &middot; Updated every 60s
          </p>
        </div>
        <Badge variant="outline" className="hidden text-xs sm:flex">
          Total Volume: $63.8M+
        </Badge>
      </div>

      <Tabs defaultValue="championship">
        <TabsList className="mb-4">
          <TabsTrigger value="championship">{t("championship")}</TabsTrigger>
          <TabsTrigger value="raceWinner">{t("raceWinner")}</TabsTrigger>
          <TabsTrigger value="props">{t("props")}</TabsTrigger>
        </TabsList>

        {(
          Object.entries(MARKETS) as [
            string,
            typeof MARKETS.championship,
          ][]
        ).map(([key, markets]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {markets.map((market) => (
              <Card key={market.question}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-sm font-semibold sm:text-base">
                      {market.question}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {t("volume")}: {market.volume}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        Ends {market.endDate}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {market.outcomes.map((o) => (
                      <div key={o.name}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{o.name}</span>
                          <span className="text-sm font-bold tabular-nums">
                            {(o.price * 100).toFixed(0)}%
                          </span>
                        </div>
                        {/* Full-width probability bar */}
                        <div className="h-2 w-full rounded-full bg-accent/50">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${o.price * 100}%`,
                              backgroundColor: o.color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[10px] text-muted-foreground">
                      {t("lastUpdated")}: 2 min ago
                    </span>
                    <a
                      href="https://polymarket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-red-500 hover:text-red-400"
                    >
                      {t("betOn")} &rarr;
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
