"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";

const primaryNav = [
  { key: "races", href: "/races" },
  { key: "markets", href: "/markets" },
  { key: "standings", href: "/standings" },
  { key: "analytics", href: "/analytics" },
  { key: "news", href: "/news" },
] as const;

const SESSION_LABEL: Record<string, string> = {
  fp1: "FP1",
  fp2: "FP2",
  fp3: "FP3",
  sprintQualifying: "SQ",
  sprint: "SPRINT",
  qualifying: "QUALI",
  race: "RACE",
};

export interface SeasonBadge {
  status: "live" | "raceWeekend" | "midSeason" | "offSeason";
  liveSession: string | null;
  round: number;
  total: number;
}

export function Header({ season }: { season?: SeasonBadge }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function switchLocale() {
    const next = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: next });
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function statusBadge() {
    if (!season) return null;
    if (season.status === "live") {
      return (
        <span className="live-chip">
          <span className="dot" />
          {SESSION_LABEL[season.liveSession || "race"] || "LIVE"} {tc("live")}
        </span>
      );
    }
    if (season.status === "raceWeekend") {
      return (
        <span className="hidden sm:inline-flex items-center gap-1.5 f1-data" style={{ fontSize: "11px", letterSpacing: "1px", color: "#E10600" }}>
          <span className="h-1.5 w-1.5 rounded-full animate-live" style={{ background: "#E10600" }} />
          {tc("raceWeekend")}
        </span>
      );
    }
    if (season.status === "midSeason") {
      return (
        <span className="hidden sm:inline-flex items-center gap-1.5 f1-data" style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-dim, #888)" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-green, #00d26a)" }} />
          R{season.round}/{season.total} · 2026
        </span>
      );
    }
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 f1-data" style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-dim, #888)" }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--text-dim, #888)" }} />
        {tc("offSeason")}
      </span>
    );
  }

  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(7,7,12,0.82)", backdropFilter: "blur(20px) saturate(1.4)" }}>
      <div className="mx-auto flex items-center justify-between px-5 sm:px-10" style={{ height: "56px" }}>
        {/* Logo with EKG pulse */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="14" viewBox="0 0 56 20" fill="none" aria-hidden="true">
            <path
              className="pulse-line"
              d="M0 12 H14 L18 12 L22 3 L27 17 L31 8 L34 12 H56"
              stroke="#E10600"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="f1-display" style={{ fontSize: "18px", letterSpacing: "2px", color: "var(--text-primary, #eeeef0)" }}>
            F1 PULSE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center md:flex" style={{ gap: "28px" }}>
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative py-4 f1-heading f1-transition"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "1.2px",
                color: isActive(item.href) ? "var(--text-primary, #eeeef0)" : "var(--text-secondary, #8b8b9e)",
                textDecoration: "none",
              }}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <span className="absolute left-0 right-0" style={{ bottom: "0", height: "2px", background: "#E10600", boxShadow: "0 0 8px rgba(225,6,0,0.6)" }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {statusBadge()}

          {/* Command palette trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("f1pulse:palette"))}
            className="hidden items-center gap-2 sm:flex f1-transition"
            aria-label={tc("search")}
            style={{
              padding: "5px 10px",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              borderRadius: "6px",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-dim, #888)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <kbd className="f1-data" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>⌘K</kbd>
          </button>

          {/* Locale switcher */}
          <button
            onClick={switchLocale}
            className="f1-transition"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "12px",
              letterSpacing: "1px",
              color: "var(--text-dim, #888)",
              padding: "4px 10px",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              borderRadius: "4px",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {locale === "en" ? "中 / EN" : "EN / 中"}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{ transition: "background 0.2s" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M4 4L12 12M12 4L4 12" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 4H14M2 8H14M2 12H14" stroke="#eeeef0" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — secondary destinations (primary 4 live in the bottom tab bar) */}
      {mobileOpen && (
        <nav className="px-5 py-3 md:hidden animate-fade-up" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-primary, #07070c)", animationDuration: "0.25s" }}>
          <div className="flex flex-col gap-0.5">
            {([...primaryNav, { key: "drivers", href: "/drivers" }, { key: "teams", href: "/teams" }] as const).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-3 f1-heading"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "1.2px",
                  color: isActive(item.href) ? "#E10600" : "var(--text-dim, #888)",
                  background: isActive(item.href) ? "rgba(225,6,0,0.06)" : "transparent",
                  textDecoration: "none",
                }}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="h-px w-full" style={{ background: "var(--border-subtle, rgba(255,255,255,0.05))" }} />
    </header>
  );
}
