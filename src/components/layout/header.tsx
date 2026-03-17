"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";

const navItems = [
  { key: "races", href: "/races" },
  { key: "drivers", href: "/drivers" },
  { key: "teams", href: "/teams" },
  { key: "markets", href: "/markets" },
  { key: "sponsorships", href: "/sponsorships" },
  { key: "stocks", href: "/stocks" },
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

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-xl">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E10600] to-transparent" />

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="f1-display" style={{ fontSize: "1.25rem", letterSpacing: "-0.03em", color: "#E10600" }}>
            F1
          </span>
          <span className="f1-display" style={{ fontSize: "1.25rem", letterSpacing: "-0.03em", color: "#ededed" }}>
            PULSE
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`f1-transition relative px-3 py-1.5 f1-label ${
                isActive(item.href) ? "!text-white" : "!text-[#555] hover:!text-white"
              }`}
              style={{ fontSize: "0.6875rem" }}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 bg-[#E10600]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={switchLocale}
            className="f1-transition f1-label rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2.5 py-1 hover:border-[#E10600]/30 hover:!text-white"
            style={{ fontSize: "0.5625rem" }}
          >
            {locale === "en" ? "中文" : "ENG"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="f1-transition flex h-8 w-8 items-center justify-center rounded hover:bg-[#161616] md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {mobileOpen ? (
                <path d="M4 4L12 12M12 4L4 12" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 4H14M2 8H14M2 12H14" stroke="#ededed" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[#1c1c1c] bg-[#080808] px-5 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`f1-transition rounded px-3 py-2.5 f1-label ${
                  isActive(item.href)
                    ? "bg-[#E10600]/10 !text-[#E10600]"
                    : "!text-[#555] hover:!text-white"
                }`}
                style={{ fontSize: "0.6875rem" }}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="h-px w-full bg-[#1c1c1c]" />
    </header>
  );
}
