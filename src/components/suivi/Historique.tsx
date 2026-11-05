"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, Button, Chip } from "@heroui/react";

import { formatteurJour } from "./format";

import {
  retirerBadgeDeRemise,
  supprimerRemise,
} from "@/actions/suivi/remise.actions";
import { Icon } from "@/lib/icons";
import { parGroupe } from "@/lib/suivi";
import { ConfirmPopover } from "@/components/ui";

export type RemisePassee = {
  id: string;
  nom: string;
  date: Date;
  creePar: { name: string } | null;
  badges: {
    id: string;
    chef: { name: string; groupe: string | null };
    etape: { name: string };
  }[];
};

type HistoriqueProps = {
  remises: RemisePassee[];
  peutGerer: boolean;
  statistiques?: React.ReactNode;
};

export function Historique({
  remises,
  peutGerer,
  statistiques,
}: HistoriqueProps) {
  const router = useRouter();

  const executer =
    (action: () => Promise<{ success: boolean; error?: string }>) =>
    async () => {
      const result = await action();

      if (result.success) {
        router.refresh();
      }

      return result;
    };

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Remises de badges</h2>
          <p className="text-tiny text-default-500">
            Chaque remise regroupe les badges remis lors d&apos;un même
            événement.
          </p>
        </div>

        {remises.length === 0 ? (
          <div className="rounded-[22px] bg-dashboard-panel p-8 text-center text-sm text-default-500">
            Aucune remise enregistrée pour l&apos;instant.
          </div>
        ) : (
          <Accordion
            className="px-0"
            itemClasses={{
              base: "bg-dashboard-panel rounded-[22px] px-4 mb-3 shadow-none",
              title: "font-semibold",
            }}
            selectionMode="multiple"
            variant="light"
          >
            {remises.map((remise) => (
              <AccordionItem
                key={remise.id}
                aria-label={remise.nom}
                subtitle={`${formatteurJour.format(remise.date)}${remise.creePar ? ` · enregistrée par ${remise.creePar.name}` : ""}`}
                title={
                  <div className="flex items-center gap-2">
                    <span>{remise.nom}</span>
                    <Chip size="sm" variant="flat">
                      {remise.badges.length} badge
                      {remise.badges.length > 1 ? "s" : ""}
                    </Chip>
                  </div>
                }
              >
                <div className="flex flex-col gap-4 pb-4">
                  {parGroupe(remise.badges).map(([groupe, badges]) => (
                    <div key={groupe} className="flex flex-col gap-1">
                      <p className="text-tiny font-semibold uppercase tracking-wider text-foreground/40">
                        {groupe}
                      </p>
                      <ul className="flex flex-col">
                        {badges.map((badge) => (
                          <li
                            key={badge.id}
                            className="flex items-center justify-between gap-3 border-b border-dashboard-border/60 py-2 text-sm last:border-b-0"
                          >
                            <span>
                              <span className="font-medium">
                                {badge.chef.name}
                              </span>{" "}
                              <span className="text-default-500">
                                · {badge.etape.name}
                              </span>
                            </span>
                            {peutGerer && (
                              <ConfirmPopover
                                confirmLabel="Retirer"
                                message="Le badge repassera dans « À remettre »."
                                titre="Retirer ce badge de la remise ?"
                                onConfirm={executer(() =>
                                  retirerBadgeDeRemise(badge.id),
                                )}
                              >
                                <Button
                                  isIconOnly
                                  aria-label={`Retirer ${badge.chef.name} de la remise`}
                                  size="sm"
                                  variant="light"
                                >
                                  <Icon icon="solar:close-circle-linear" />
                                </Button>
                              </ConfirmPopover>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {peutGerer && (
                    <ConfirmPopover
                      confirmLabel="Supprimer"
                      message="Ses badges repasseront dans « À remettre »."
                      titre="Supprimer cette remise ?"
                      onConfirm={executer(() => supprimerRemise(remise.id))}
                    >
                      <Button
                        className="self-start"
                        color="danger"
                        size="sm"
                        startContent={
                          <Icon icon="solar:trash-bin-trash-linear" />
                        }
                        variant="flat"
                      >
                        Supprimer la remise
                      </Button>
                    </ConfirmPopover>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {statistiques}
    </div>
  );
}
