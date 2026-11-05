"use client";

import { cn } from "@heroui/react";

type FiltreSegmenteProps<T extends string> = {
  options: readonly { key: T; label: string }[];
  valeur: T;
  onChange: (valeur: T) => void;
};

export function FiltreSegmente<T extends string>({
  options,
  valeur,
  onChange,
}: FiltreSegmenteProps<T>) {
  return (
    <div className="flex w-fit flex-wrap rounded-full bg-dashboard-card p-1">
      {options.map((option) => (
        <button
          key={option.key}
          aria-pressed={valeur === option.key}
          className={cn(
            "rounded-full px-3 py-1.5 text-tiny font-medium transition-colors duration-fast",
            valeur === option.key
              ? "bg-nav-active text-white"
              : "text-default-500 hover:text-foreground",
          )}
          type="button"
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
