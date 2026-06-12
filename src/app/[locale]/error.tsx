"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <svg width="56" height="20" viewBox="0 0 56 20" fill="none" aria-hidden="true">
        <path
          d="M0 12 H14 L18 12 L22 3 L27 17 L31 8 L34 12 H56"
          stroke="#E10600"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 className="f1-display-md" style={{ color: "var(--text-primary, #eeeef0)" }}>
        Red flag — something went wrong
      </h2>
      <p className="f1-body" style={{ color: "var(--text-secondary, #8b8b9e)", maxWidth: "420px" }}>
        Live timing data hit a snag. Try again — the session usually restarts quickly.
      </p>
      <button
        onClick={reset}
        className="f1-heading"
        style={{
          fontSize: "12px",
          letterSpacing: "1px",
          padding: "10px 24px",
          borderRadius: "8px",
          border: "1px solid rgba(225,6,0,0.4)",
          background: "rgba(225,6,0,0.08)",
          color: "#E10600",
          cursor: "pointer",
        }}
      >
        Restart session
      </button>
    </div>
  );
}
