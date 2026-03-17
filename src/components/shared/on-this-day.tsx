"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getOnThisDay, type F1Event } from "@/lib/data/on-this-day";

const CATEGORY_COLORS: Record<F1Event["category"], string> = {
  race: "#E10600",
  championship: "#FFD700",
  record: "#22c55e",
  debut: "#3671C6",
  tragedy: "#666",
};

const CATEGORY_LABELS: Record<F1Event["category"], { en: string; zh: string }> = {
  race: { en: "Race", zh: "比赛" },
  championship: { en: "Title", zh: "冠军" },
  record: { en: "Record", zh: "纪录" },
  debut: { en: "Debut", zh: "首秀" },
  tragedy: { en: "Memorial", zh: "纪念" },
};

export function OnThisDay() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [data, setData] = useState<ReturnType<typeof getOnThisDay> | null>(null);
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    setData(getOnThisDay(month, day));

    const monthNames = locale === "zh"
      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setTodayStr(`${monthNames[month - 1]} ${day}`);
  }, [locale]);

  if (!data) return null;

  const { events, isExact, fallbackDate } = data;

  // Build fallback date string
  let dateLabel = todayStr;
  if (!isExact && fallbackDate) {
    const monthNames = locale === "zh"
      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dateLabel = `${monthNames[fallbackDate.month - 1]} ${fallbackDate.day}`;
  }

  return (
    <div className="f1-surface p-5 animate-fade-up stagger-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="f1-accent-bar" />
          <span className="f1-heading text-white">{t("onThisDay")}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isExact && (
            <span className="f1-label-xs" style={{ color: "#444" }}>
              {locale === "zh" ? "临近日期" : "Nearest"}
            </span>
          )}
          <span className="f1-label !text-[#E10600]">{dateLabel}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {events.map((event, i) => (
          <div
            key={`${event.year}-${event.month}-${event.day}-${i}`}
            className="f1-transition flex items-start gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]"
          >
            {/* Year */}
            <span className="f1-data text-xs font-bold shrink-0 mt-0.5" style={{ color: "#E10600" }}>
              {event.year}
            </span>

            {/* Event text */}
            <p className="f1-body-sm flex-1 min-w-0" style={{ color: "#999" }}>
              {locale === "zh" ? event.eventZh : event.event}
            </p>

            {/* Category badge */}
            <span
              className="f1-label-xs shrink-0 rounded px-1.5 py-0.5 mt-0.5"
              style={{
                backgroundColor: `${CATEGORY_COLORS[event.category]}15`,
                color: CATEGORY_COLORS[event.category],
              }}
            >
              {locale === "zh" ? CATEGORY_LABELS[event.category].zh : CATEGORY_LABELS[event.category].en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
