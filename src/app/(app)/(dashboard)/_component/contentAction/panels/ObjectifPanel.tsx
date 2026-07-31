"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Justification } from "@prisma/client";
import { Tabs, Tab, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { Divider } from "@heroui/divider";

import {
  EtapeAvecObjectifs,
  ObjectifAvecJustification,
} from "../../DashboardClient";

import StatusChip from "./StatusChip";
import ObjectifModal from "./ObjectifModal";

import { DEFAULT_ETAPE_COLOR, getReadableTextColor } from "@/lib/color";

interface ObjectifPanelProps {
  selectedEtape: EtapeAvecObjectifs | null;
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
  targetSubTab?: string | null;
}

export default function ObjectifPanel({
  selectedEtape,
  onUpdateJustification,
  targetSubTab,
}: ObjectifPanelProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedObjectif, setSelectedObjectif] =
    useState<ObjectifAvecJustification | null>(null);
  const [activeTab, setActiveTab] = useState<React.Key>("competence");

  useEffect(() => {
    if (targetSubTab) {
      setActiveTab(targetSubTab);
    }
  }, [targetSubTab]);

  const handleOpenModal = (objectif: ObjectifAvecJustification) => {
    setSelectedObjectif(objectif);
    onOpen();
  };

  if (!selectedEtape) {
    return (
      <div className="flex flex-col items-center py-8 gap-3 text-gray-500 text-md">
        <Icon className="text-6xl mb-4" icon="solar:tag-linear" />
        <p>Sélectionnez un badge pour voir ses objectifs </p>
      </div>
    );
  }

  const competences = selectedEtape.objectifs.filter(
    (o) => o.type === "COMPETENCE",
  ) as ObjectifAvecJustification[];
  const realisations = selectedEtape.objectifs.filter(
    (o) => o.type === "REALISATION",
  ) as ObjectifAvecJustification[];
  const etapeColor = selectedEtape.couleur || DEFAULT_ETAPE_COLOR;
  const etapeFg = getReadableTextColor(etapeColor);

  return (
    <div>
      <div
        className="flex w-full flex-col"
        style={
          {
            "--etape-color": etapeColor,
            "--etape-fg": etapeFg,
          } as React.CSSProperties
        }
      >
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">
            Étape {selectedEtape.name}
          </h2>
          {selectedEtape.image_src && (
            <Image
              alt={`Badge ${selectedEtape.name}`}
              className="shrink-0"
              height={24}
              src={selectedEtape.image_src}
              width={24}
            />
          )}
        </div>

        <Tabs
          aria-label="Options"
          classNames={{
            tabList:
              "gap-1 md:gap-8 w-full max-w-md rounded-3xl p-1.5 bg-dashboard-tab",
            cursor:
              "!bg-[var(--etape-color)] rounded-2xl md:before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-white before:text-lg before:font-bold",
            tab: "px-1 md:px-6 h-10 relative md:text-sm text-xs",
            tabContent:
              "text-black group-data-[selected=true]:text-white md:group-data-[selected=true]:pl-6 group-data-[selected=true]:font-semibold font-medium transition-all duration-300 ease-in-out",
          }}
          selectedKey={activeTab as string}
          onSelectionChange={setActiveTab}
        >
          <Tab key="competence" title="Compétences">
            <Divider className="mt-3" />

            <ul className="space-y-3">
              {competences.map((c) => (
                <li key={c.id} className="">
                  <div className="py-4 px-5 rounded-md flex md:block items-center flex-col md:flex-row">
                    <div className="flex mb-2 md:mb-0 items-center w-full">
                      <div className="flex-1 flex items-center ">
                        <span className="font-semibold text-sm text-foreground border border-dashboard-border rounded-full w-10 h-10 flex items-center justify-center mr-2.5 shrink-0">
                          {c.code}
                        </span>
                        <div className="hidden md:block text-[16px]">
                          {c.description}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-6 ">
                        <StatusChip
                          statut={c.justifications[0]?.statut || null}
                        />
                        <Button
                          isIconOnly
                          aria-label="ouvrir compétence"
                          className="bg-dashboard-tab hover:bg-dashboard-tab-hover"
                          color="default"
                          variant="faded"
                          onPress={() => handleOpenModal(c)}
                        >
                          <Icon
                            icon="solar:maximize-square-3-linear"
                            width={24}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="block md:hidden text-[16px]">
                      {c.description}
                    </div>
                  </div>
                  <div className="px-5">
                    <Divider />
                  </div>
                </li>
              ))}
            </ul>
          </Tab>
          <Tab key="realisations" title="Réalisations">
            <Divider className="mt-3" />
            <ul className="space-y-3">
              {realisations.map((r) => (
                <li key={r.id} className="">
                  <div className="py-4 px-5 rounded-md flex md:block items-center flex-col md:flex-row">
                    <div className="flex mb-2 md:mb-0 items-center w-full">
                      <div className="flex-1 flex items-center ">
                        <span className="text-sm text-foreground border border-dashboard-border rounded-full w-9 h-9 flex items-center justify-center mr-2.5 shrink-0">
                          {r.code}
                        </span>
                        <div className="hidden md:block text-[16px]">
                          {r.description}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-6 ">
                        <StatusChip
                          statut={r.justifications[0]?.statut || null}
                        />
                        <Button
                          isIconOnly
                          aria-label="ouvrir réalisation"
                          className="bg-dashboard-tab hover:bg-dashboard-tab-hover"
                          color="default"
                          variant="faded"
                          onPress={() => handleOpenModal(r)}
                        >
                          <Icon
                            icon="solar:maximize-square-3-linear"
                            width={24}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="block md:hidden text-[16px]">
                      {r.description}
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
        objectif={selectedObjectif}
        onOpenChange={onOpenChange}
        onUpdateJustification={onUpdateJustification}
      />
    </div>
  );
}
