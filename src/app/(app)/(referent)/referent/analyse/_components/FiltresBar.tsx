"use client";

import type { AnalyticsPeriode } from "@/lib/analytics";
import type { OptionFiltre } from "@/services/analytics.service";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectItem, cn } from "@heroui/react";

import { PERIODES } from "@/lib/analytics";

type FiltresBarProps = {
  periode: AnalyticsPeriode;
  etapeId?: string;
  referentId?: string;
  etapes: OptionFiltre[];
  referents: OptionFiltre[];
};

export function FiltresBar({
  periode,
  etapeId,
  referentId,
  etapes,
  referents,
}: FiltresBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const appliquer = React.useCallback(
    (cle: string, valeur: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (valeur) {
        params.set(cle, valeur);
      } else {
        params.delete(cle);
      }

      startTransition(() => {
        router.replace(`/referent/analyse?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [router, searchParams],
  );

  const selectClassNames = {
    trigger:
      "bg-dashboard-panel shadow-inset-border data-[hover=true]:bg-dashboard-panel-hover",
    popoverContent: "bg-dashboard-panel border border-dashboard-border",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end",
        isPending && "opacity-60",
      )}
    >
      <div
        aria-label="Période"
        className="flex rounded-full bg-dashboard-card p-1"
        role="group"
      >
        {PERIODES.map((option) => (
          <button
            key={option.key}
            aria-pressed={option.key === periode}
            className={cn(
              "rounded-full px-3 py-1.5 text-tiny font-medium transition-colors duration-fast",
              option.key === periode
                ? "bg-nav-active text-white"
                : "text-default-500 hover:text-foreground",
            )}
            type="button"
            onClick={() => appliquer("periode", option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Select
        aria-label="Filtrer par étape"
        className="sm:max-w-56"
        classNames={selectClassNames}
        label="Étape"
        labelPlacement="outside"
        placeholder="Toutes les étapes"
        selectedKeys={etapeId ? [etapeId] : []}
        size="sm"
        onSelectionChange={(keys) =>
          appliquer("etapeId", Array.from(keys)[0] as string | undefined)
        }
      >
        {etapes.map((etape) => (
          <SelectItem key={etape.id}>{etape.name}</SelectItem>
        ))}
      </Select>

      <Select
        aria-label="Filtrer par référent"
        className="sm:max-w-56"
        classNames={selectClassNames}
        label="Référent"
        labelPlacement="outside"
        placeholder="Tous les référents"
        selectedKeys={referentId ? [referentId] : []}
        size="sm"
        onSelectionChange={(keys) =>
          appliquer("referentId", Array.from(keys)[0] as string | undefined)
        }
      >
        {referents.map((referent) => (
          <SelectItem key={referent.id}>{referent.name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
