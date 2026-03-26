import { HeroNextRace } from "@/components/home/hero-next-race";
import { MarketOverview } from "@/components/home/market-overview";
import { SeasonSnapshot } from "@/components/home/season-snapshot";
import { NewsSection } from "@/components/home/news-section";
import { getHomepageData } from "@/lib/data/home";
import { getNewsData, type NewsItem } from "@/lib/data/news";
import type { HomepageData } from "@/types";

export default async function HomePage() {
  const [data, news] = await Promise.all([
    getHomepageData(),
    getNewsData().catch(() => [] as NewsItem[]),
  ]);
  return <HomePageContent data={data} news={news.slice(0, 3)} />;
}

function HomePageContent({ data, news }: { data: HomepageData; news: NewsItem[] }) {
  const { nextRace, standings, recent, maxPts } = data;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary, #07070c)" }}>
      {/* Section 1: Hero */}
      <HeroNextRace race={nextRace} />

      {/* Section 2: Market Overview */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", marginBottom: "80px" }}>
        <MarketOverview />
      </div>

      {/* Section 3: Season Snapshot */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", marginBottom: "80px" }}>
        <SeasonSnapshot standings={standings} recent={recent} maxPts={maxPts} />
      </div>

      {/* Section 4: News */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", marginBottom: "80px" }}>
        <NewsSection news={news} />
      </div>
    </div>
  );
}
