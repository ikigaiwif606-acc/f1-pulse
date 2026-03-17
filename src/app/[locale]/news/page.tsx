import { useTranslations, useLocale } from "next-intl";
import { getNewsData, getSourceCounts, type NewsItem } from "@/lib/data/news";

const CATEGORY_COLORS: Record<string, string> = {
  official: "#E10600",
  analysis: "#FF8000",
  tech: "#27F4D2",
  general: "#3671C6",
};

const CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  official: { en: "Official", zh: "官方" },
  analysis: { en: "Analysis", zh: "分析" },
  tech: { en: "Technical", zh: "技术" },
  general: { en: "News", zh: "新闻" },
};

export default async function NewsPage() {
  const news = await getNewsData();
  return <NewsContent news={news} />;
}

function NewsContent({ news }: { news: NewsItem[] }) {
  const t = useTranslations("news");
  const locale = useLocale();
  const sources = getSourceCounts(news);

  // Split into featured (first 3) and rest
  const featured = news.slice(0, 3);
  const rest = news.slice(3);

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">{t("intelligence")}</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">
            {news.length} {t("articles")} &middot; {sources.length} {t("sources")} &middot; {t("updatedEvery15m")}
          </p>
        </div>

        {/* Source badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sources.map((s) => (
            <div key={s.source} className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="f1-label-xs !text-white">{s.source}</span>
              <span className="f1-data text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{s.count}</span>
            </div>
          ))}
        </div>

        {/* Featured articles */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          {featured.map((item, i) => (
            <a
              key={item.link + i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="f1-surface-primary f1-corner-accent p-5 f1-transition hover:border-[#333] group block"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="f1-label-xs rounded px-1.5 py-0.5"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[item.category]}15`,
                    color: CATEGORY_COLORS[item.category],
                  }}
                >
                  {locale === "zh" ? CATEGORY_LABELS[item.category].zh : CATEGORY_LABELS[item.category].en}
                </span>
                <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>{item.timeAgo}</span>
              </div>
              <h3 className="f1-body font-semibold text-white mb-2 group-hover:text-[#E10600] f1-transition line-clamp-3">
                {item.title}
              </h3>
              <p className="f1-body-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {item.description}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.sourceColor }} />
                <span className="f1-label-xs" style={{ color: item.sourceColor }}>{item.source}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Article list */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("latestHeadlines")}</span>
          </div>

          <div className="space-y-1">
            {rest.map((item, i) => (
              <a
                key={item.link + i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="f1-transition flex items-start gap-3 f1-surface-inner p-3 hover:bg-[#0d0d0d] group rounded"
              >
                {/* Time */}
                <span className="f1-data text-[0.625rem] shrink-0 mt-0.5 w-10 text-right" style={{ color: "var(--text-dim)" }}>
                  {item.timeAgo}
                </span>

                {/* Category indicator */}
                <div className="f1-team-bar h-8 shrink-0 mt-0.5" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="f1-body-sm font-semibold text-white group-hover:text-[#E10600] f1-transition truncate">
                    {item.title}
                  </h4>
                  <p className="f1-label-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                    {item.description}
                  </p>
                </div>

                {/* Source */}
                <div className="shrink-0 hidden sm:flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.sourceColor }} />
                  <span className="f1-label-xs" style={{ color: item.sourceColor }}>{item.source}</span>
                </div>

                {/* Arrow */}
                <span className="f1-label shrink-0 mt-0.5" style={{ color: "var(--text-subtle)" }}>&rarr;</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-[#131313] pt-5">
          <p className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
