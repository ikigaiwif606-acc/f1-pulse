import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MARKETS = {
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

export default function MarketsPage() {
  const t = useTranslations("markets");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="f1-label !text-[#E10600]">Polymarket</span>
            <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
            <p className="f1-label mt-1">Live odds &middot; Updated every 60s</p>
          </div>
          <div className="hidden items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2.5 py-1 sm:flex">
            <span className="f1-label-xs">Total Vol</span>
            <span className="f1-data text-sm text-white">$63.8M+</span>
          </div>
        </div>

        <Tabs defaultValue="championship">
          <TabsList className="mb-5 h-auto gap-1 rounded border border-[#1c1c1c] bg-[#0f0f0f] p-1">
            {["championship", "raceWinner", "props"].map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="f1-label rounded px-3 py-1.5 data-[state=active]:bg-[#E10600] data-[state=active]:!text-white"
                style={{ fontSize: "0.625rem" }}
              >
                {t(key as "championship" | "raceWinner" | "props")}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.entries(MARKETS) as [string, typeof MARKETS.championship][]).map(([key, markets]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {markets.map((market) => (
                <div key={market.question} className="f1-surface p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="f1-display-md text-white">{market.question}</h3>
                    <div className="flex gap-2">
                      <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                        Vol {market.volume}
                      </span>
                      <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                        Ends {market.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {market.outcomes.map((o) => (
                      <div key={o.name} className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]">
                        <div className="f1-team-bar h-5" style={{ backgroundColor: o.color }} />
                        <span className="f1-data w-8 text-[0.625rem]" style={{ color: "#444" }}>{o.code}</span>
                        <span className="f1-body-sm flex-1 font-semibold text-white">{o.name}</span>

                        <div className="hidden w-32 sm:block">
                          <div className="h-[3px] w-full rounded-full bg-[#161616]">
                            <div className="h-[3px] rounded-full" style={{ width: `${o.price * 100}%`, backgroundColor: o.color }} />
                          </div>
                        </div>

                        <div className="w-14 rounded border border-[#1c1c1c] bg-[#0f0f0f] py-1 text-center">
                          <span className="f1-data text-sm text-white">{(o.price * 100).toFixed(0)}</span>
                          <span className="f1-label-xs ml-px">%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#131313] pt-3">
                    <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>{t("lastUpdated")}: 2 min ago</span>
                    <a
                      href="https://polymarket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                    >
                      {t("betOn")} &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
