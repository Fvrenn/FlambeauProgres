"use client";

import type { User } from "@prisma/client";
import type { AdminEtapeWithReferents } from "@/types";

import React from "react";
import { Image } from "@heroui/react";

import AssignationModal from "./_components/AssignationModal";

import { Avatar } from "@/components/ui";

type AssignationsClientPageProps = {
  etapes: AdminEtapeWithReferents[];
  allReferents: User[];
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
          étape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {etapes.map((etape) => (
          <div
            key={etape.id}
            className="flex flex-col rounded-[22px] overflow-hidden bg-[#FAF6EB]"
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-6 pt-6 pb-4">
              <div className="w-11 h-11 rounded-full bg-dashboard-border flex items-center justify-center overflow-hidden shrink-0">
                {etape.image_src ? (
                  <Image
                    alt={etape.name}
                    height={44}
                    src={etape.image_src}
                    width={44}
                  />
                ) : (
                  <span className="text-base font-bold text-foreground/40">
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

            {/* Separator */}
            <div className="h-px bg-dashboard-border mx-6" />

            {/* Referents */}
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

            {/* Footer */}
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
