"use client";

import type { NewsItem } from "@/lib/data/news";

interface NewsSectionProps {
  news: NewsItem[];
}

// Emoji placeholders for news thumbnails
const THUMB_EMOJIS = ["\u{1F3CE}\uFE0F", "\u{1F5FE}", "\u{1F3C1}", "\u{1F3C6}", "\u{1F3F3}\uFE0F"];

export function NewsSection({ news }: NewsSectionProps) {
  if (!news.length) return null;

  const items = news.slice(0, 3);

  return (
    <section className="section-animate">
      <div className="flex items-baseline justify-between" style={{ marginBottom: "20px" }}>
        <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-primary, #eeeef0)" }}>
          Headlines
        </div>
        <a href="/en/news" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)", textDecoration: "none", fontWeight: 500 }}>
          More News &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "20px" }}>
        {items.map((item, i) => (
          <a
            key={item.link + i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card-hover"
            style={{
              background: "var(--bg-secondary, #0e0e18)",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "all 0.25s ease",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            {/* Thumbnail placeholder */}
            <div style={{ width: "100%", height: "160px", position: "relative", overflow: "hidden" }}>
              <div className="news-thumb-zoom" style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "40px",
                background: `linear-gradient(135deg, var(--bg-tertiary, #161625), var(--bg-hover, #1c1c30))`,
                transition: "transform 0.4s ease",
              }}>
                {THUMB_EMOJIS[i % THUMB_EMOJIS.length]}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px 18px" }}>
              <div style={{
                fontSize: "14px", fontWeight: 600,
                lineHeight: 1.5, color: "var(--text-primary, #eeeef0)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
                marginBottom: "8px",
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: "11px",
                color: "var(--text-muted, #4e4e62)",
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.3px",
              }}>
                {item.source} &middot; {item.timeAgo}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
