"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold tracking-wider text-[#E10600]">
              F1
            </span>
            <span className="font-display text-sm font-bold tracking-wider text-white">
              PULSE
            </span>
            <div className="ml-2 flex items-center gap-1.5 rounded border border-[#1f1f1f] bg-[#111] px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-live" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#4a4a4a]">
            <span>OpenF1</span>
            <span className="text-[#2a2a2a]">/</span>
            <span>Polymarket</span>
            <span className="text-[#2a2a2a]">/</span>
            <span>Jolpica</span>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-[#1a1a1a]" />

        <p className="mt-3 text-center text-[9px] uppercase tracking-wider text-[#3a3a3a] sm:text-left">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
