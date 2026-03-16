"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-[7px] font-black text-white">
              F1
            </div>
            <span className="text-sm font-semibold">Pulse</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              APIs Online
            </div>
            <span>&middot;</span>
            <span>{t("poweredBy")}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-muted-foreground sm:text-left">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
