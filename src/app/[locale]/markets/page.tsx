import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MARKETS = {
  championship: [
    { question: "Who will win the 2026 F1 Drivers' Championship?", volume: "$18.2M", outcomes: [
      { name: "George Russell", price: 0.57 },
      { name: "Kimi Antonelli", price: 0.15 },
      { name: "Charles Leclerc", price: 0.10 },
    ]},
    { question: "Who will win the 2026 Constructors' Championship?", volume: "$12.1M", outcomes: [
      { name: "Mercedes", price: 0.65 },
      { name: "Ferrari", price: 0.18 },
      { name: "McLaren", price: 0.10 },
    ]},
  ],
  raceWinner: [
    { question: "Who will win the 2026 Japanese Grand Prix?", volume: "$2.4M", outcomes: [
      { name: "George Russell", price: 0.28 },
      { name: "Kimi Antonelli", price: 0.22 },
      { name: "Charles Leclerc", price: 0.15 },
    ]},
  ],
  props: [
    { question: "Will there be a safety car at the Japanese GP?", volume: "$340K", outcomes: [
      { name: "Yes", price: 0.35 },
      { name: "No", price: 0.65 },
    ]},
    { question: "F1 Action of the Year 2026 Award Winner?", volume: "$180K", outcomes: [
      { name: "Max Verstappen", price: 0.20 },
      { name: "Lewis Hamilton", price: 0.18 },
    ]},
  ],
};

export default function MarketsPage() {
  const t = useTranslations("markets");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <Tabs defaultValue="championship">
        <TabsList>
          <TabsTrigger value="championship">{t("championship")}</TabsTrigger>
          <TabsTrigger value="raceWinner">{t("raceWinner")}</TabsTrigger>
          <TabsTrigger value="props">{t("props")}</TabsTrigger>
        </TabsList>

        {(Object.entries(MARKETS) as [string, typeof MARKETS.championship][]).map(
          ([key, markets]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {markets.map((market) => (
                <Card key={market.question}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{market.question}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {t("volume")}: {market.volume}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {market.outcomes.map((o) => (
                        <div key={o.name} className="flex items-center justify-between">
                          <span className="text-sm">{o.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 rounded-full bg-red-500/20" style={{ width: `${o.price * 100}px` }}>
                              <div
                                className="h-2 rounded-full bg-red-500"
                                style={{ width: `${o.price * 100}%` }}
                              />
                            </div>
                            <span className="w-12 text-right text-sm font-bold">
                              {(o.price * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-right">
                      <a
                        href="https://polymarket.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-500 hover:underline"
                      >
                        {t("betOn")} &rarr;
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
