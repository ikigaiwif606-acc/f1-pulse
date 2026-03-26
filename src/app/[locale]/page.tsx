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
    <div className="min-h-screen bg-[#080808]">
      {/* Section 1: Hero — Next Race Countdown */}
      <HeroNextRace race={nextRace} />

      {/* Section 2: Market Overview — Integrated Odds Table */}
      <div className="mx-auto max-w-7xl px-5 py-8">
        <MarketOverview />
      </div>

      {/* Section 3: Season Snapshot — Standings vs Market */}
      <div className="mx-auto max-w-7xl px-5 pb-8">
        <SeasonSnapshot standings={standings} recent={recent} maxPts={maxPts} />
      </div>

      {/* Section 4: News — Featured Headlines */}
      <div className="mx-auto max-w-7xl px-5 pb-12">
        <NewsSection news={news} />
      </div>
    </div>
  );
}
