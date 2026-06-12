"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Home, Flag, TrendingUp, Trophy } from "lucide-react";

const tabs = [
  { key: "home", href: "/", icon: Home },
  { key: "races", href: "/races", icon: Flag },
  { key: "markets", href: "/markets", icon: TrendingUp },
  { key: "standings", href: "/standings", icon: Trophy },
] as const;

export function MobileTabbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {tabs.map(({ key, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={key}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            style={{ textDecoration: "none", minHeight: "56px" }}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              size={18}
              strokeWidth={active ? 2.2 : 1.6}
              color={active ? "#E10600" : "var(--text-dim, #888)"}
            />
            <span
              className="f1-label-xs"
              style={{ color: active ? "var(--text-primary, #eeeef0)" : "var(--text-dim, #888)" }}
            >
              {t(key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
