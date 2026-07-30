"use client";

import type { User } from "@prisma/client";
import type { AdminEtapeWithReferents } from "@/types";

import React from "react";
import { Image } from "@heroui/react";

import AssignationModal from "./_components/AssignationModal";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
} from "@/components/ui";

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
        <h1 className="text-2xl font-bold">Assignation des Référents</h1>
        <p className="text-default-500">
          Gérez quels référents sont responsables de la validation de chaque
          étape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {etapes.map((etape) => (
          <Card key={etape.id} isHoverable variant="elevated">
            <CardHeader className="flex-row items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full bg-[#E8E7DE]/60 flex items-center justify-center overflow-hidden shrink-0">
                {etape.image_src ? (
                  <Image
                    alt={etape.name}
                    height={48}
                    src={etape.image_src}
                    width={48}
                  />
                ) : (
                  <span className="text-lg font-bold text-default-400">
                    {etape.number}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold">{etape.name}</p>
                <p className="text-small text-default-500">
                  {etape.referents.length} Référent(s)
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-2">
                <p className="text-tiny font-bold uppercase text-default-400">
                  Référents assignés
                </p>
                {etape.referents.length > 0 ? (
                  <div className="flex -space-x-2">
                    {etape.referents.slice(0, 5).map((r) => (
                      <Avatar
                        key={r.referentId}
                        className="ring-2 ring-white"
                        name={r.referent.name}
                        size="sm"
                        src={r.referent.image || undefined}
                      />
                    ))}
                    {etape.referents.length > 5 && (
                      <div
                        className="flex items-center justify-center rounded-full bg-[#E8E7DE] text-[11px] font-medium text-[#0f1511] ring-2 ring-white"
                        style={{ width: 28, height: 28 }}
                      >
                        +{etape.referents.length - 5}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-small text-default-400 italic">
                    Aucun référent assigné
                  </p>
                )}
              </div>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color="primary"
                variant="flat"
                onClick={() => handleManage(etape)}
              >
                Gérer les assignations
              </Button>
            </CardFooter>
          </Card>
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
