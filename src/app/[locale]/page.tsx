import { HeroNextRace } from "@/components/home/hero-next-race";
import { MarketOverview } from "@/components/home/market-overview";
import { MarketMovers } from "@/components/home/market-movers";
import { SeasonSnapshot } from "@/components/home/season-snapshot";
import { NewsSection } from "@/components/home/news-section";
import { getHomepageData } from "@/lib/data/home";
import { getNewsData, type NewsItem } from "@/lib/data/news";

export const revalidate = 300;

export default async function HomePage() {
  const [data, news] = await Promise.all([
    getHomepageData(),
    getNewsData().catch(() => [] as NewsItem[]),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary, #07070c)" }}>
      {/* Section 1: Command-center hero */}
      <HeroNextRace
        race={data.nextRace}
        status={data.seasonStatus}
        liveSession={data.liveSession}
        seasonProgress={data.seasonProgress}
      />

      <div className="mx-auto flex flex-col px-5 sm:px-10" style={{ maxWidth: "1200px", gap: "56px", paddingBottom: "72px" }}>
        {/* Section 2: Live prediction markets */}
        <MarketOverview />

        {/* Section 3: Standings + recent results */}
        <SeasonSnapshot
          standings={data.standings}
          recent={data.recent}
          maxPts={data.maxPts}
          seasonProgress={data.seasonProgress}
        />

        {/* Section 4: Movers + headlines */}
        <section className="section-animate grid gap-5 lg:grid-cols-[1fr_2fr]">
          <MarketMovers />
          <NewsSection news={news.slice(0, 3)} />
        </section>
      </div>
    </div>
  );
}
