"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { NewsItem } from "@/lib/data/news";

interface NewsSectionProps {
  news: NewsItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  official: "#E10600",
  analysis: "#FF8000",
  tech: "#27F4D2",
  general: "#3671C6",
};

export function NewsSection({ news }: NewsSectionProps) {
  const tCommon = useTranslations("common");

  if (!news.length) return null;

  // Show max 3 news items
  const items = news.slice(0, 3);

  return (
    <section className="animate-fade-up stagger-3">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="f1-accent-bar" />
          <span className="f1-heading text-white">Headlines</span>
        </div>
        <Link href="/news" className="f1-transition f1-label hover:!text-white">
          More News &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <a
            key={item.link + i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="f1-surface f1-transition group overflow-hidden hover:border-[rgba(255,255,255,0.12)]"
          >
            {/* Thumbnail placeholder — colored band */}
            <div
              className="h-28 sm:h-32 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[item.category] || "#3671C6"}15, ${CATEGORY_COLORS[item.category] || "#3671C6"}05)`,
              }}
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute bottom-3 left-4">
                <span
                  className="f1-label-xs rounded px-1.5 py-0.5"
                  style={{
                    color: CATEGORY_COLORS[item.category] || "#3671C6",
                    backgroundColor: `${CATEGORY_COLORS[item.category] || "#3671C6"}20`,
                  }}
                >
                  {item.category}
                </span>
              </div>
              {/* Hover zoom effect on the pattern */}
              <div className="absolute inset-0 f1-transition group-hover:scale-[1.03]" />
            </div>

            <div className="p-4">
              <h4 className="f1-body font-semibold text-white group-hover:text-[#E10600] f1-transition line-clamp-2 mb-3">
                {item.title}
              </h4>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.sourceColor }} />
                <span className="f1-label-xs" style={{ color: item.sourceColor }}>{item.source}</span>
                <span className="f1-label-xs !text-[var(--text-ghost)]">&middot;</span>
                <span className="f1-label-xs !text-[var(--text-ghost)]">{item.timeAgo}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
