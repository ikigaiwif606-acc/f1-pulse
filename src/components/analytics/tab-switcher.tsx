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
      <nav className="sticky top-12 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-[#1c1c1c] mb-6 -mx-5 px-5">
        <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 f1-label f1-transition ${
                active === i
                  ? "bg-[#E10600] !text-white border border-[#E10600]"
                  : "border border-[#1c1c1c] bg-[#0c0c0c] hover:!text-white hover:border-[#333] hover:bg-[#161616]"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
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
