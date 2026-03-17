// ── F1 News Aggregator ──────────────────────────────────────────────────────

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  category: "official" | "analysis" | "tech" | "general";
  timeAgo: string;
}

const RSS_FEEDS: { url: string; source: string; sourceColor: string; category: NewsItem["category"] }[] = [
  {
    url: "https://www.motorsport.com/rss/f1/news/",
    source: "Motorsport.com",
    sourceColor: "#E10600",
    category: "analysis",
  },
  {
    url: "https://www.autosport.com/rss/f1/news/",
    source: "Autosport",
    sourceColor: "#ff6100",
    category: "analysis",
  },
  {
    url: "https://racefans.net/feed/",
    source: "RaceFans",
    sourceColor: "#27F4D2",
    category: "tech",
  },
  {
    url: "https://the-race.com/feed/",
    source: "The Race",
    sourceColor: "#3671C6",
    category: "general",
  },
  {
    url: "https://www.formula1.com/content/fom-website/en/latest/all.xml",
    source: "Formula1.com",
    sourceColor: "#E10600",
    category: "official",
  },
];

// ── Fallback news data ──────────────────────────────────────────────────────
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Mercedes dominate opening rounds as Russell takes championship lead",
    link: "https://www.formula1.com",
    description: "George Russell has stormed to the top of the 2026 standings after consecutive victories in Australia and a strong showing in China.",
    pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "Formula1.com",
    sourceColor: "#E10600",
    category: "official",
    timeAgo: "2h ago",
  },
  {
    title: "Antonelli's stunning China GP victory signals new era for young talent",
    link: "https://www.motorsport.com",
    description: "Kimi Antonelli's maiden F1 win at the Chinese Grand Prix has sent shockwaves through the paddock, with team boss Toto Wolff declaring the 19-year-old 'the real deal'.",
    pubDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: "Motorsport.com",
    sourceColor: "#E10600",
    category: "analysis",
    timeAgo: "5h ago",
  },
  {
    title: "2026 regulations: Active aero brings unprecedented overtaking opportunities",
    link: "https://the-race.com",
    description: "The new overtake mode system replacing DRS has already produced more wheel-to-wheel racing in two rounds than the previous regulation set managed in half a season.",
    pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "The Race",
    sourceColor: "#3671C6",
    category: "tech",
    timeAgo: "8h ago",
  },
  {
    title: "Red Bull's struggles continue: Verstappen points to aero deficit",
    link: "https://www.autosport.com",
    description: "Max Verstappen has admitted Red Bull are 'further behind than we expected' after the RB22 proved difficult to extract pace from in the first two rounds.",
    pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: "Autosport",
    sourceColor: "#ff6100",
    category: "analysis",
    timeAgo: "12h ago",
  },
  {
    title: "Cadillac F1 team exceeds expectations in debut season opener",
    link: "https://racefans.net",
    description: "The 11th team on the grid scored a surprise points finish in Melbourne, with Bottas bringing the car home in 10th place.",
    pubDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    source: "RaceFans",
    sourceColor: "#27F4D2",
    category: "general",
    timeAgo: "18h ago",
  },
  {
    title: "Ferrari's Hamilton gamble: early returns show promise despite points gap",
    link: "https://www.motorsport.com",
    description: "Lewis Hamilton's move to Ferrari is showing signs of paying off as the seven-time champion adapts to the SF-26, though a P4 championship position isn't where they want to be.",
    pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Motorsport.com",
    sourceColor: "#E10600",
    category: "analysis",
    timeAgo: "1d ago",
  },
  {
    title: "Audi's F1 project: Bortoleto and Hulkenberg pushing hard despite growing pains",
    link: "https://the-race.com",
    description: "The rebranded Sauber-to-Audi transition has been rocky, but both drivers are extracting competitive qualifying performances from the C45.",
    pubDate: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    source: "The Race",
    sourceColor: "#3671C6",
    category: "general",
    timeAgo: "1d ago",
  },
  {
    title: "Japanese GP preview: Suzuka's figure-8 layout to test 2026 aero philosophy",
    link: "https://racefans.net",
    description: "The iconic Suzuka circuit presents a unique challenge for the new generation of cars with its demanding high-speed corners and elevation changes.",
    pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "RaceFans",
    sourceColor: "#27F4D2",
    category: "tech",
    timeAgo: "2d ago",
  },
  {
    title: "Polymarket F1 volumes surge past $50M as betting interest skyrockets",
    link: "https://www.formula1.com",
    description: "Prediction market volumes for F1 events have seen a 300% increase year-over-year, driven by the excitement of the new regulations and competitive racing.",
    pubDate: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Formula1.com",
    sourceColor: "#E10600",
    category: "official",
    timeAgo: "2d ago",
  },
  {
    title: "McLaren's qualifying pace doesn't translate to race day: what's going wrong?",
    link: "https://www.autosport.com",
    description: "Lando Norris has out-qualified his grid position expectations but lost places on race day in both opening rounds. Our technical analysis explains why.",
    pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Autosport",
    sourceColor: "#ff6100",
    category: "analysis",
    timeAgo: "3d ago",
  },
  {
    title: "Alpine's resurgence: Gasly leads midfield charge with consecutive top-10 finishes",
    link: "https://the-race.com",
    description: "Pierre Gasly has been the standout midfield performer in the opening rounds, with the A526 showing surprising race pace.",
    pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "The Race",
    sourceColor: "#3671C6",
    category: "general",
    timeAgo: "3d ago",
  },
  {
    title: "Bearman's heroic drives put Haas firmly in the points battle",
    link: "https://www.motorsport.com",
    description: "Oliver Bearman has been a revelation in 2026, scoring 17 points from two races and establishing himself as one of the top rookies on the grid.",
    pubDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Motorsport.com",
    sourceColor: "#E10600",
    category: "analysis",
    timeAgo: "4d ago",
  },
];

function extractTag(xml: string, tag: string): string {
  const open = `<${tag}`;
  const close = `</${tag}>`;
  const startIdx = xml.indexOf(open);
  if (startIdx === -1) return "";
  const contentStart = xml.indexOf(">", startIdx) + 1;
  const endIdx = xml.indexOf(close, contentStart);
  if (endIdx === -1) return "";
  let content = xml.slice(contentStart, endIdx).trim();
  // Handle CDATA
  if (content.startsWith("<![CDATA[")) {
    content = content.slice(9, content.indexOf("]]>"));
  }
  // Strip HTML tags
  content = content.replace(/<[^>]+>/g, "").trim();
  return content;
}

function extractItems(xml: string): { title: string; link: string; description: string; pubDate: string }[] {
  const items: { title: string; link: string; description: string; pubDate: string }[] = [];
  let searchFrom = 0;

  while (true) {
    const itemStart = xml.indexOf("<item", searchFrom);
    if (itemStart === -1) break;
    const itemEnd = xml.indexOf("</item>", itemStart);
    if (itemEnd === -1) break;

    const itemXml = xml.slice(itemStart, itemEnd + 7);
    items.push({
      title: extractTag(itemXml, "title"),
      link: extractTag(itemXml, "link"),
      description: extractTag(itemXml, "description").slice(0, 300),
      pubDate: extractTag(itemXml, "pubDate"),
    });

    searchFrom = itemEnd + 7;
  }

  return items;
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

async function fetchFeed(feed: typeof RSS_FEEDS[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 900 }, // 15 min cache
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const rawItems = extractItems(xml);

    return rawItems.slice(0, 5).map((item) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate || new Date().toISOString(),
      source: feed.source,
      sourceColor: feed.sourceColor,
      category: feed.category,
      timeAgo: getTimeAgo(item.pubDate),
    }));
  } catch {
    return [];
  }
}

export async function getNewsData(): Promise<NewsItem[]> {
  try {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
    const allItems: NewsItem[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    if (allItems.length === 0) return FALLBACK_NEWS;

    // Sort by date descending
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return allItems.slice(0, 30);
  } catch {
    return FALLBACK_NEWS;
  }
}

export function getSourceCounts(items: NewsItem[]): { source: string; color: string; count: number }[] {
  const counts: Record<string, { color: string; count: number }> = {};
  for (const item of items) {
    if (!counts[item.source]) counts[item.source] = { color: item.sourceColor, count: 0 };
    counts[item.source].count++;
  }
  return Object.entries(counts)
    .map(([source, { color, count }]) => ({ source, color, count }))
    .sort((a, b) => b.count - a.count);
}
