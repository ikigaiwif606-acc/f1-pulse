import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  getSponsorshipData,
  getTotalEstimatedValue,
  F1_GLOBAL_PARTNERS,
  type Sponsor,
} from "@/lib/data/sponsorships";

const DEAL_BADGES: Record<string, { label: string; labelZh: string; cls: string }> = {
  title:     { label: "Title",     labelZh: "冠名",   cls: "bg-[#E10600] !text-white" },
  major:     { label: "Major",     labelZh: "主要",   cls: "bg-[#27F4D2]/10 !text-[#27F4D2]" },
  technical: { label: "Technical", labelZh: "技术",   cls: "bg-[#3671C6]/10 !text-[#3671C6]" },
  official:  { label: "Official",  labelZh: "官方",   cls: "bg-[#131313] !text-[#555]" },
};

export default function SponsorshipsPage() {
  const teams = getSponsorshipData();
  return <SponsorshipsContent teams={teams} />;
}

function SponsorshipsContent({ teams }: { teams: ReturnType<typeof getSponsorshipData> }) {
  const t = useTranslations("sponsorships");
  const locale = useLocale();

  // Count total sponsors and title deals
  const totalSponsors = teams.reduce((s, t) => s + t.sponsors.length, 0);
  const titleDeals = teams.filter((t) => t.titleSponsor).length;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">{t("intelligence")}</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">
            {teams.length} {t("teams_count")} &middot; {totalSponsors} {t("partnerships")} &middot; {titleDeals} {t("titleSponsorsCount")}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-6">
          {[
            { label: t("totalPartners"), value: totalSponsors.toString() },
            { label: t("titleSponsors"), value: titleDeals.toString() },
            { label: t("topDeal"), value: "HP / Ferrari", sub: "$100M/yr" },
            { label: t("newEntrant"), value: "Cadillac", sub: "11th team" },
          ].map((s) => (
            <div key={s.label} className="f1-surface p-4 text-center">
              <p className="f1-label-xs mb-2">{s.label}</p>
              <p className="f1-data-lg text-white">{s.value}</p>
              {s.sub && <p className="f1-label-xs mt-1" style={{ color: "var(--text-dim)" }}>{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Team sponsorship blocks */}
        <div className="space-y-3 mb-8">
          {teams.map((team) => {
            const estValue = getTotalEstimatedValue(team.teamId);

            return (
              <div key={team.teamId} className="rounded border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
                <div className="h-px w-full" style={{ backgroundColor: team.color }} />
                <div className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="f1-team-bar h-6" style={{ backgroundColor: team.color }} />
                    <div>
                      <Link href={`/teams/${team.teamId}` as "/"} className="f1-display-md text-white hover:text-[#E10600] f1-transition">
                        {team.team}
                      </Link>
                      {team.titleSponsor && (
                        <span className="f1-label-xs ml-2" style={{ color: "var(--text-dim)" }}>
                          {team.titleSponsor}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                      {team.sponsors.length} {t("partners")}
                    </span>
                    <span className="hidden sm:inline f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5 !text-[#22c55e]">
                      {estValue}
                    </span>
                  </div>
                </div>

                <div className="grid gap-px bg-[#1c1c1c] sm:grid-cols-2 lg:grid-cols-3">
                  {team.sponsors.map((s) => (
                    <SponsorCard key={s.name} sponsor={s} teamColor={team.color} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* F1 Global Partners */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("globalPartners")}</span>
          </div>
          <p className="f1-label mb-4">{locale === "zh" ? "F1官方系列赛赞助合作" : "Official Formula 1 series-level partnerships"}</p>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {F1_GLOBAL_PARTNERS.map((p) => (
              <div key={p.name} className="f1-surface-inner p-3 rounded">
                <p className="f1-body-sm font-semibold text-white">{p.name}</p>
                <p className="f1-label-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{p.role}</p>
                <p className="f1-label-xs mt-1" style={{ color: "var(--text-subtle)" }}>{p.industry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-[#131313] pt-5">
          <p className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
            {locale === "zh"
              ? "F1 Pulse · 赞助数据来自官方车队网站和新闻发布 · 金额为报道估计值"
              : "F1 Pulse · Sponsorship data curated from official team websites and press releases · Values are reported estimates"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SponsorCard({ sponsor, teamColor }: { sponsor: Sponsor; teamColor: string }) {
  const locale = useLocale();
  const badge = DEAL_BADGES[sponsor.dealType] ?? DEAL_BADGES.official;

  return (
    <div className="bg-[#0a0a0a] p-4 f1-transition hover:bg-[#0d0d0d]">
      <div className="flex items-start justify-between mb-2">
        <span className="f1-body-sm font-semibold text-white">{sponsor.name}</span>
        <span className={`f1-label rounded px-1.5 py-0.5 shrink-0 ml-2 ${badge.cls}`}>
          {locale === "zh" ? badge.labelZh : badge.label}
        </span>
      </div>
      <p className="f1-label-xs mb-2" style={{ color: "var(--text-subtle)" }}>{sponsor.industry}</p>
      <div className="flex items-center gap-3">
        {sponsor.reportedValue && (
          <span className="f1-data text-xs text-[#22c55e]">{sponsor.reportedValue}</span>
        )}
        {sponsor.contractEnd && (
          <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>→ {sponsor.contractEnd}</span>
        )}
      </div>
    </div>
  );
}
