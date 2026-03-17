import { useTranslations } from "next-intl";
import { RaceReplay } from "@/components/replay/race-replay";

export default function ReplayPage() {
  return <ReplayContent />;
}

function ReplayContent() {
  const t = useTranslations("replay");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">{t("intelligence")}</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">
            {t("description")}
          </p>
        </div>

        {/* Race selector badge */}
        <div className="mb-6 flex items-center gap-2">
          <span className="f1-label rounded bg-[#E10600] px-2 py-0.5 !text-white">R1</span>
          <span className="f1-display-md text-white">Australian Grand Prix</span>
          <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>Melbourne &middot; 58 laps</span>
        </div>

        <RaceReplay />

        {/* Footer */}
        <div className="mt-6 border-t border-[#131313] pt-5">
          <p className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
