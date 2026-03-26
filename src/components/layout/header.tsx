"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";

const primaryNav = [
  { key: "races", href: "/races" },
  { key: "markets", href: "/markets" },
  { key: "standings", href: "/drivers" },
  { key: "analytics", href: "/analytics" },
] as const;

export function Header() {
  const t = useTranslations("nav");
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

  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(7,7,12,0.82)", backdropFilter: "blur(20px) saturate(1.4)" }}>
      <div className="mx-auto flex items-center justify-between px-5 sm:px-10" style={{ height: "56px" }}>
        {/* Logo with red dot */}
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E10600]" style={{ boxShadow: "0 0 10px #E10600, 0 0 20px rgba(225,6,0,0.3)" }} />
          <span className="f1-display" style={{ fontSize: "18px", letterSpacing: "2px", color: "var(--text-primary, #eeeef0)" }}>
            F1 PULSE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center md:flex" style={{ gap: "32px" }}>
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative py-4"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "1.2px",
                textTransform: "uppercase" as const,
                color: isActive(item.href) ? "var(--text-primary, #eeeef0)" : "var(--text-secondary, #8b8b9e)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <span className="absolute left-0 right-0" style={{ bottom: "0", height: "2px", background: "#E10600" }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: "1px", color: "var(--text-muted, #4e4e62)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--text-muted, #4e4e62)" }} />
            OFF-SEASON
          </div>

          {/* Locale switcher */}
          <button
            onClick={switchLocale}
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "12px",
              letterSpacing: "1px",
              color: "var(--text-muted, #4e4e62)",
              padding: "4px 10px",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              borderRadius: "4px",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {locale === "en" ? "\u4E2D / EN" : "EN / \u4E2D"}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded md:hidden"
            aria-label="Toggle menu"
            style={{ transition: "background 0.2s" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {mobileOpen ? (
                <path d="M4 4L12 12M12 4L4 12" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 4H14M2 8H14M2 12H14" stroke="#eeeef0" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="px-5 py-3 md:hidden animate-fade-up" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-primary, #07070c)", animationDuration: "0.25s" }}>
          <div className="flex flex-col gap-0.5">
            {primaryNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-3"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase" as const,
                  color: isActive(item.href) ? "#E10600" : "var(--text-muted, #4e4e62)",
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
