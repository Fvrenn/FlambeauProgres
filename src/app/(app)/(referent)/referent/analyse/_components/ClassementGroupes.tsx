"use client";

import type { OrigineGroupe, ValidationsGroupe } from "@/lib/groupes";

import React from "react";
import { cn } from "@heroui/react";

import { ClassementChart } from "./ClassementChart";

import { classerGroupes } from "@/lib/groupes";

const ORIGINES: { key: OrigineGroupe; label: string }[] = [
  { key: "TOUTES", label: "Toutes" },
  { key: "APP", label: "Flambeaux Progrès" },
  { key: "PLATEFORME", label: "Plateforme" },
];

export function ClassementGroupes({
  groupes,
}: {
  groupes: ValidationsGroupe[];
}) {
  const [origine, setOrigine] = React.useState<OrigineGroupe>("TOUTES");

  const data = React.useMemo(
    () =>
      classerGroupes(groupes, origine).map((groupe) => ({
        id: groupe.cle,
        label: groupe.libelle,
        total: groupe.total,
      })),
    [groupes, origine],
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        aria-label="Origine des validations"
        className="flex w-fit rounded-full bg-dashboard-card p-1"
        role="group"
      >
        {ORIGINES.map((option) => (
          <button
            key={option.key}
            aria-pressed={option.key === origine}
            className={cn(
              "rounded-full px-3 py-1.5 text-tiny font-medium transition-colors duration-fast",
              option.key === origine
                ? "bg-nav-active text-white"
                : "text-default-500 hover:text-foreground",
            )}
            type="button"
            onClick={() => setOrigine(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ClassementChart
        data={data}
        messageVide="Aucun groupe connu pour l'instant"
      />
    </div>
  );
}
