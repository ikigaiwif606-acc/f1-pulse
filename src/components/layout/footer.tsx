"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-[#1c1c1c] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="f1-display" style={{ fontSize: "0.875rem", color: "#E10600" }}>F1</span>
            <span className="f1-display" style={{ fontSize: "0.875rem", color: "#ededed" }}>PULSE</span>
            <div className="ml-1 flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-live" />
              <span className="f1-label-xs !text-emerald-500">Live</span>
            </div>
          </div>

          {/* Footer nav links */}
          <div className="flex items-center gap-4">
            <Link href="/news" className="f1-label-xs !text-[var(--text-ghost)] hover:!text-white f1-transition">
              {tNav("news")}
            </Link>
            <Link href="/sponsorships" className="f1-label-xs !text-[var(--text-ghost)] hover:!text-white f1-transition">
              {tNav("sponsorships")}
            </Link>
            <Link href="/replay" className="f1-label-xs !text-[var(--text-ghost)] hover:!text-white f1-transition">
              {tNav("replay")}
            </Link>
            <Link href="/teams" className="f1-label-xs !text-[var(--text-ghost)] hover:!text-white f1-transition">
              {tNav("teams")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {["OpenF1", "Polymarket", "Jolpica"].map((src, i) => (
              <span key={src}>
                {i > 0 && <span className="mr-3 text-[#1c1c1c]">/</span>}
                <span className="f1-label-xs">{src}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-[#131313]" />
        <p className="f1-label-xs mt-3 text-center sm:text-left" style={{ color: "var(--text-subtle)" }}>
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
