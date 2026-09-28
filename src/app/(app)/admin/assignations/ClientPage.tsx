"use client";

import type { AdminEtapeWithReferents, UserResume } from "@/types";

import React from "react";
import Image from "next/image";

import AssignationModal from "./_components/AssignationModal";

import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/ui";

type AssignationsClientPageProps = {
  etapes: AdminEtapeWithReferents[];
  allReferents: UserResume[];
};

export default function AssignationsClientPage({
  etapes,
  allReferents,
}: AssignationsClientPageProps) {
  const [selectedEtape, setSelectedEtape] =
    React.useState<AdminEtapeWithReferents | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleManage = (etape: AdminEtapeWithReferents) => {
    setSelectedEtape(etape);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold">Assignation des Référents</h1>
        <p className="text-default-500">
          Gérez quels référents sont responsables de la validation de chaque
          spécialité.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-[16px] border border-dashboard-border bg-dashboard-panel px-4 py-3 text-sm text-default-600">
        <Icon
          className="mt-0.5 shrink-0 text-default-400"
          icon="solar:info-circle-linear"
          width={18}
        />
        <p>
          L&apos;étape 3 « Servir » ne se gère pas ici : ses compétences et
          réalisations sont évaluées par la{" "}
          <strong>commission Formation</strong>, puis l&apos;étape est validée
          par le <strong>Coordinateur National</strong>. Ces rôles
          s&apos;attribuent dans la page Utilisateurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {etapes.map((etape) => (
          <div
            key={etape.id}
            className="flex flex-col rounded-[22px] overflow-hidden bg-[#FAF6EB]"
          >
            <div className="flex items-center gap-4 px-6 pt-6 pb-4">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                {etape.image_src ? (
                  <Image
                    alt={etape.name}
                    className="object-contain"
                    height={44}
                    src={etape.image_src}
                    width={44}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-dashboard-border text-base font-bold text-foreground/40">
                    {etape.number}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-[15px]">{etape.name}</p>
                <p className="text-xs text-foreground/40">
                  {etape.referents.length} référent
                  {etape.referents.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="h-px bg-dashboard-border mx-6" />

            <div className="flex flex-col gap-3 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                Référents assignés
              </p>
              {etape.referents.length > 0 ? (
                <div className="flex -space-x-2">
                  {etape.referents.slice(0, 5).map((r) => (
                    <Avatar
                      key={r.referentId}
                      className="ring-2 ring-[#FAF6EB]"
                      name={r.referent.name}
                      size="sm"
                      src={r.referent.image || undefined}
                    />
                  ))}
                  {etape.referents.length > 5 && (
                    <div
                      className="flex items-center justify-center rounded-full bg-dashboard-border text-[11px] font-medium text-foreground ring-2 ring-[#FAF6EB]"
                      style={{ width: 28, height: 28 }}
                    >
                      +{etape.referents.length - 5}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">
                  Aucun référent assigné
                </p>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                className="w-full rounded-[12px] py-2 text-[13px] font-semibold text-white cursor-pointer transition-colors"
                style={{ backgroundColor: "#2f4a35" }}
                onClick={() => handleManage(etape)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4d634f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2f4a35")
                }
              >
                Gérer les assignations
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEtape && (
        <AssignationModal
          allReferents={allReferents}
          etape={selectedEtape}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEtape(null);
          }}
        />
      )}
    </div>
  );
}
