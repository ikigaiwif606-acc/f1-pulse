import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header, type SeasonBadge } from "@/components/layout/header";
import { OddsTicker } from "@/components/layout/odds-ticker";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { getSeasonContext } from "@/lib/data/season";

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
  const ctx = await getSeasonContext().catch(() => null);
  const season: SeasonBadge | undefined = ctx
    ? {
        status: ctx.status,
        liveSession: ctx.liveSession,
        round: ctx.nextRace?.round ?? ctx.totalRounds,
        total: ctx.totalRounds,
      }
    : undefined;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col has-tabbar-padding">
        <Header season={season} />
        <OddsTicker />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileTabbar />
      </div>
    </NextIntlClientProvider>
  );
}
