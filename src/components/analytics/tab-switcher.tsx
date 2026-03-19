"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: ReactNode;
}

export function TabSwitcher({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <nav className="sticky top-12 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-[#1c1c1c] mb-8 -mx-5 px-5">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActive(i)}
              className={`relative shrink-0 px-4 py-3 f1-label f1-transition ${
                active === i
                  ? "!text-white"
                  : "hover:!text-white hover:bg-[#161616]"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
              {active === i && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E10600] rounded-t" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className={active === i ? "animate-fade-up" : "hidden"}
          style={{ animationDuration: "0.3s" }}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
