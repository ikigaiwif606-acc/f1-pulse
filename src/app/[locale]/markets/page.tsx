import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MARKETS = {
  championship: [
    {
      question: "Who will win the 2026 F1 Drivers' Championship?",
      volume: "$18.2M",
      endDate: "Dec 6, 2026",
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
      volume: "$12.1M",
      endDate: "Dec 6, 2026",
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
      volume: "$2.4M",
      endDate: "Mar 29, 2026",
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
      volume: "$340K",
      endDate: "Mar 29, 2026",
      outcomes: [
        { name: "Yes", code: "YES", price: 0.35, color: "#f59e0b" },
        { name: "No", code: "NO", price: 0.65, color: "#6b7280" },
      ],
    },
    {
      question: "F1 Action of the Year 2026 Award Winner?",
      volume: "$180K",
      endDate: "Dec 31, 2026",
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
              Polymarket
            </span>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
              Live odds &middot; Updated every 60s
            </p>
          </div>
          <div className="hidden items-center gap-1.5 rounded border border-[#1f1f1f] bg-[#111] px-2.5 py-1 sm:flex">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
              Total Vol
            </span>
            <span className="timing-number text-sm font-bold text-white">$63.8M+</span>
          </div>
        </div>

        <Tabs defaultValue="championship">
          <TabsList className="mb-5 h-auto gap-1 rounded-lg border border-[#1f1f1f] bg-[#111] p-1">
            {["championship", "raceWinner", "props"].map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-[#E10600] data-[state=active]:text-white"
              >
                {t(key as "championship" | "raceWinner" | "props")}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.entries(MARKETS) as [string, typeof MARKETS.championship][]).map(
            ([key, markets]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                {markets.map((market) => (
                  <div
                    key={market.question}
                    className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4 sm:p-5"
                  >
                    {/* Market header */}
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                        {market.question}
                      </h3>
                      <div className="flex gap-2">
                        <span className="rounded border border-[#1f1f1f] bg-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                          Vol {market.volume}
                        </span>
                        <span className="rounded border border-[#1f1f1f] bg-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                          Ends {market.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Outcomes */}
                    <div className="space-y-1.5">
                      {market.outcomes.map((o) => (
                        <div
                          key={o.name}
                          className="flex items-center gap-3 rounded bg-[#0a0a0a] p-2.5"
                        >
                          <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: o.color }} />
                          <span className="timing-number w-8 text-[10px] font-bold text-[#4a4a4a]">{o.code}</span>
                          <span className="flex-1 text-sm font-medium text-white">{o.name}</span>

                          {/* Bar */}
                          <div className="hidden w-32 sm:block">
                            <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
                              <div
                                className="h-[4px] rounded-full transition-all duration-500"
                                style={{ width: `${o.price * 100}%`, backgroundColor: o.color }}
                              />
                            </div>
                          </div>

                          {/* Price */}
                          <div className="w-14 rounded border border-[#1f1f1f] bg-[#111] py-1 text-center">
                            <span className="timing-number text-sm font-bold text-white">
                              {(o.price * 100).toFixed(0)}
                            </span>
                            <span className="text-[9px] text-[#4a4a4a]">%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#2a2a2a]">
                        {t("lastUpdated")}: 2 min ago
                      </span>
                      <a
                        href="https://polymarket.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E10600] transition-opacity hover:opacity-70"
                      >
                        {t("betOn")} &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
}
