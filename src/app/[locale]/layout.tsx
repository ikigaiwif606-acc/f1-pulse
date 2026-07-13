import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header, type SeasonBadge } from "@/components/layout/header";
import { OddsTicker } from "@/components/layout/odds-ticker";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { CommandPalette, type PaletteItem } from "@/components/layout/command-palette";
import { getSeasonContext } from "@/lib/data/season";
import { getDriversList } from "@/lib/data/drivers";
import { getTeamsList } from "@/lib/data/teams";
import { getMarketsMeta } from "@/lib/data/markets";

const PALETTE_PAGES = ["races", "markets", "standings", "analytics", "news", "drivers", "teams", "replay"] as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const [ctx, drivers, teams, championshipMeta] = await Promise.all([
    getSeasonContext().catch(() => null),
    getDriversList().catch(() => []),
    getTeamsList().catch(() => []),
    getMarketsMeta("championship").catch(() => null),
  ]);

  const season: SeasonBadge | undefined = ctx
    ? {
        status: ctx.status,
        liveSession: ctx.liveSession,
        round: ctx.nextRace?.round ?? ctx.totalRounds,
        total: ctx.totalRounds,
      }
    : undefined;

  const navLabels: Record<string, string> = messages.nav || {};
  const paletteItems: PaletteItem[] = [
    ...PALETTE_PAGES.map((key) => ({
      type: "page" as const,
      label: navLabels[key] || key,
      href: key === "standings" ? "/standings" : `/${key}`,
    })),
    ...(ctx?.races || []).map((r) => ({
      type: "race" as const,
      label: r.name,
      sub: `R${r.round} · ${r.date}${r.next ? " · NEXT" : r.completed ? ` · 🏆 ${r.winner || ""}` : ""}`,
      href: `/races/${r.slug}`,
    })),
    ...drivers.map((d) => ({
      type: "driver" as const,
      label: d.name,
      sub: `${d.team} · ${d.pts} pts`,
      href: `/drivers/${d.id}`,
      color: d.color,
    })),
    ...teams.map((t) => ({
      type: "team" as const,
      label: t.name,
      sub: `P${t.pos} · ${t.pts} pts`,
      href: `/teams/${t.id}`,
      color: t.color,
    })),
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col has-tabbar-padding">
        <Header season={season} />
        <OddsTicker initial={championshipMeta ?? undefined} />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileTabbar />
        <CommandPalette items={paletteItems} />
      </div>
    </NextIntlClientProvider>
  );
}
