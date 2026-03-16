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
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl">
      {/* Red accent line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E10600] to-transparent" />

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-6 items-center">
            <span className="font-display text-xl font-bold tracking-wide text-[#E10600]">
              F1
            </span>
            <span className="font-display ml-1 text-xl font-bold tracking-wide text-white">
              PULSE
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                isActive(item.href)
                  ? "text-white"
                  : "text-[#737373] hover:text-white"
              }`}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#E10600]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={switchLocale}
            className="rounded border border-[#2a2a2a] bg-[#161616] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#737373] transition-all hover:border-[#E10600]/30 hover:text-white"
          >
            {locale === "en" ? "中文" : "ENG"}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#1a1a1a] md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {mobileOpen ? (
                <path d="M4 4L12 12M12 4L4 12" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 4H14M2 8H14M2 12H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isActive(item.href)
                    ? "bg-[#E10600]/10 text-[#E10600]"
                    : "text-[#737373] hover:text-white"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Bottom border */}
      <div className="h-px w-full bg-[#1f1f1f]" />
    </header>
  );
}
