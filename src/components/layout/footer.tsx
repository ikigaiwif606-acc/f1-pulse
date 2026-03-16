"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground">
        <p>{t("disclaimer")}</p>
        <p className="mt-2">{t("poweredBy")}</p>
      </div>
    </footer>
  );
}
