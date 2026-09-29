import React from "react";

const SILHOUETTE =
  "M38 6 L50 14 L62 6 L77 11 Q86 15 88 26 L95 90 L84 93 L77 42 L77 100 Q50 106 23 100 L23 42 L16 93 L5 90 L12 26 Q14 15 23 11 Z";
const COL = "M38 6 L50 14 L62 6 L60 2 L50 5 L40 2 Z";

type ChemiseSqueletteProps = {
  className?: string;
};

export default function ChemiseSquelette({
  className = "",
}: ChemiseSqueletteProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex h-full w-full items-center justify-center ${className}`}
    >
      <svg
        className="h-[80%] w-auto animate-pulse text-foreground/10"
        viewBox="0 0 100 108"
      >
        <path d={SILHOUETTE} fill="currentColor" />
        <path d={COL} fill="currentColor" />
        <path d="M50 14 L50 102" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
