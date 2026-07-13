"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Search, Flag, Users, CircuitBoard, ArrowRight } from "lucide-react";

export interface PaletteItem {
  type: "page" | "driver" | "team" | "race";
  label: string;
  sub?: string;
  href: string;
  color?: string;
}

const TYPE_ORDER: PaletteItem["type"][] = ["page", "race", "driver", "team"];

function TypeIcon({ type }: { type: PaletteItem["type"] }) {
  const props = { size: 13, strokeWidth: 1.8, color: "var(--text-dim, #888)" };
  if (type === "race") return <Flag {...props} />;
  if (type === "driver") return <Users {...props} />;
  if (type === "team") return <CircuitBoard {...props} />;
  return <ArrowRight {...props} />;
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const t = useTranslations("palette");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const openRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // State resets happen in the open/close helpers (not effects) so opening
  // always starts from a clean slate without cascading renders.
  const openPalette = useCallback(() => {
    openRef.current = true;
    setQuery("");
    setCursor(0);
    setOpen(true);
    // Focus after the overlay mounts
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closePalette = useCallback(() => {
    openRef.current = false;
    setOpen(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) closePalette();
        else openPalette();
      } else if (e.key === "Escape") {
        closePalette();
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("f1pulse:palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("f1pulse:palette", openPalette);
    };
  }, [openPalette, closePalette]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? items.filter((i) => `${i.label} ${i.sub || ""}`.toLowerCase().includes(q))
      : items.filter((i) => i.type === "page" || i.type === "race");
    return [...matched]
      .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type))
      .slice(0, 12);
  }, [items, query]);

  const go = useCallback(
    (item: PaletteItem) => {
      closePalette();
      router.push(item.href as "/");
    },
    [router, closePalette]
  );

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  }

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  const typeLabel: Record<PaletteItem["type"], string> = {
    page: t("pages"),
    race: tNav("races"),
    driver: tNav("drivers"),
    team: tNav("teams"),
  };

  let lastType: string | null = null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4"
      style={{ background: "rgba(4,4,8,0.7)", backdropFilter: "blur(6px)", paddingTop: "12vh" }}
      onClick={closePalette}
      role="dialog"
      aria-modal="true"
      aria-label={t("placeholder")}
    >
      <div
        className="w-full animate-fade-up"
        style={{
          maxWidth: "560px",
          background: "rgba(12,12,20,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          boxShadow: "0 0 60px rgba(225,6,0,0.12), 0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
          animationDuration: "0.18s",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4" style={{ borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))", height: "52px" }}>
          <Search size={15} color="#E10600" strokeWidth={2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onInputKey}
            placeholder={t("placeholder")}
            className="f1-body flex-1 bg-transparent outline-none"
            style={{ color: "var(--text-primary, #eeeef0)", fontSize: "14px", border: "none" }}
            aria-label={t("placeholder")}
          />
          <kbd className="f1-data" style={{ fontSize: "10px", color: "var(--text-dim, #888)", border: "1px solid var(--border-default, rgba(255,255,255,0.09))", borderRadius: "4px", padding: "2px 6px" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: "330px", overflowY: "auto", padding: "6px" }}>
          {results.length === 0 ? (
            <div className="f1-body py-8 text-center" style={{ color: "var(--text-dim, #888)" }}>
              {t("empty")}
            </div>
          ) : (
            results.map((item, i) => {
              const showHeader = item.type !== lastType;
              lastType = item.type;
              return (
                <div key={item.href + item.label}>
                  {showHeader && (
                    <div className="f1-label-xs px-3 pb-1 pt-3" style={{ color: "var(--text-dim, #888)" }}>
                      {typeLabel[item.type]}
                    </div>
                  )}
                  <button
                    data-idx={i}
                    onClick={() => go(item)}
                    onMouseEnter={() => setCursor(i)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
                    style={{
                      background: i === cursor ? "rgba(225,6,0,0.09)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.color ? (
                      <span style={{ width: "3px", height: "16px", borderRadius: "1px", background: item.color, flexShrink: 0 }} />
                    ) : (
                      <TypeIcon type={item.type} />
                    )}
                    <span className="f1-body" style={{ color: "var(--text-primary, #eeeef0)", fontWeight: 600 }}>
                      {item.label}
                    </span>
                    {item.sub && (
                      <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)", marginLeft: "auto" }}>
                        {item.sub}
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2" style={{ borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.05))" }}>
          <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>↑↓ {t("navigate")}</span>
          <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>↵ {t("select")}</span>
        </div>
      </div>
    </div>
  );
}
