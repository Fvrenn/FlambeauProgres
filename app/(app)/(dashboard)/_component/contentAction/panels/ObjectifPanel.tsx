"use client";

import React, { useState } from "react";
import { Etape, Objectif, Justification } from "@prisma/client";
import { Tabs, Tab, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { Divider } from "@heroui/divider";
import StatusChip from "./StatusChip";
import ObjectifModal from "./ObjectifModal";
import { EtapeAvecObjectifs, ObjectifAvecJustification } from "../../DashboardClient";

interface ObjectifPanelProps {
  selectedEtape: EtapeAvecObjectifs | null;
  onUpdateJustification: (objectifId: string, justification: Partial<Justification>) => void;
}

export default function ObjectifPanel({ selectedEtape, onUpdateJustification }: ObjectifPanelProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedObjectif, setSelectedObjectif] = useState<ObjectifAvecJustification | null>(null);

  const handleOpenModal = (objectif: ObjectifAvecJustification) => {
    setSelectedObjectif(objectif);
    onOpen();
  };

  if (!selectedEtape) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Sélectionnez un badge sur la chemise pour voir ses objectifs.</p>
      </div>
    );
  }

  const competences = selectedEtape.objectifs.filter(
    (o) => o.type === "COMPETENCE"
  ) as ObjectifAvecJustification[];
  const realisations = selectedEtape.objectifs.filter(
    (o) => o.type === "REALISATION"
  ) as ObjectifAvecJustification[];

  return (
    <div>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-8 w-full max-w-96 rounded-full p-0.5 bg-[#F3F2E9]",
            cursor:
              "!bg-danger-800 rounded-full before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
            tab: "px-6 h-12 relative",
            tabContent:
              "text-black group-data-[selected=true]:pl-6 group-data-[selected=true]:font-semibold font-medium transition-all duration-300 ease-in-out",
          }}
        >
          <Tab key="competence" title="Compétences">
            <Divider className="mt-3" />

            <ul className="space-y-2">
              {competences.map((c) => (
                <li key={c.id} className="">
                  <div className="py-6.5 px-5 rounded-md flex items-center">
                    <div className="flex-1 flex items-center">
                      <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                        {c.code}
                      </span>
                      {c.description}
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                      <StatusChip statut={c.justifications[0]?.statut || null} />
                      <Button
                        isIconOnly
                        aria-label="ouvrir compétence"
                        color="default"
                        variant="faded"
                        onPress={() => handleOpenModal(c)}
                      >
                        <Icon icon="solar:maximize-square-3-linear" width={24} />
                      </Button>
                    </div>
                  </div>
                  <div className="px-5">
                    <Divider/>
                  </div>
                </li>
              ))}
            </ul>
          </Tab>
          <Tab key="realisations" title="Réalisations">
            <Divider className="mt-3" />
            <ul className="space-y-2">
              {realisations.map((r) => (
                <li key={r.id} className="">
                  <div className="py-6.5 px-5 rounded-md flex items-center">
                    <div className="flex-1 flex items-center">
                      <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                        {r.code}
                      </span>
                      {r.description}
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                      <StatusChip statut={r.justifications[0]?.statut || null} />
                      <Button
                        isIconOnly
                        aria-label="ouvrir réalisation"
                        color="default"
                        variant="faded"
                        onPress={() => handleOpenModal(r)}
                      >
                        <Icon icon="solar:maximize-square-3-linear" width={24} />
                      </Button>
                    </div>
                  </div>
                  <div className="px-5">
                    <Divider />
                  </div>
                </li>
              ))}
            </ul>
          </Tab>
        </Tabs>
      </div>

      <ObjectifModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        objectif={selectedObjectif}
        onUpdateJustification={onUpdateJustification}
      />
    </div>
  );
}
