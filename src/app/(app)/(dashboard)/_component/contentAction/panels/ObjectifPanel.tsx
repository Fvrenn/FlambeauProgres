"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Justification } from "@prisma/client";
import { Tabs, Tab, useDisclosure, Image as HeroImage } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { Divider } from "@heroui/divider";

import {
  EtapeAvecObjectifs,
  ObjectifAvecJustification,
} from "../../DashboardClient";

import StatusChip from "./StatusChip";
import ObjectifModal from "./ObjectifModal";

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
  const formations = selectedEtape.formations ?? [];

  return (
    <div>
      <div className="flex w-full flex-col">
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
              "gap-1 md:gap-8 w-full max-w-xl rounded-full p-0.5 bg-[#F3F2E9]",
            cursor:
              "!bg-danger-800 rounded-full md:before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
            tab: "px-1 md:px-6 h-12 relative md:text-sm text-xs",
            tabContent:
              "text-black md:group-data-[selected=true]:pl-6 group-data-[selected=true]:font-semibold font-medium transition-all duration-300 ease-in-out",
          }}
          selectedKey={activeTab as string}
          onSelectionChange={setActiveTab}
        >
          <Tab key="competence" title="Compétences">
            <Divider className="mt-3" />

            <ul className="space-y-2">
              {competences.map((c) => (
                <li key={c.id} className="">
                  <div className="py-6.5 px-5 rounded-md flex md:block items-center flex-col md:flex-row">
                    <div className="flex mb-4 md:mb-0 items-center w-full">
                      <div className="flex-1 flex items-center ">
                        <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                          {c.code}
                        </span>
                        <div className="hidden md:block">{c.description}</div>
                      </div>

                      <div className="flex items-center gap-4 ml-6 ">
                        <StatusChip
                          statut={c.justifications[0]?.statut || null}
                        />
                        <Button
                          isIconOnly
                          aria-label="ouvrir compétence"
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

                    <div className="block md:hidden">{c.description}</div>
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
            <ul className="space-y-2">
              {realisations.map((r) => (
                <li key={r.id} className="">
                  <div className="py-6.5 px-5 rounded-md flex md:block items-center flex-col md:flex-row">
                    <div className="flex mb-4 md:mb-0 items-center w-full">
                      <div className="flex-1 flex items-center ">
                        <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                          {r.code}
                        </span>
                        <div className="hidden md:block">{r.description}</div>
                      </div>

                      <div className="flex items-center gap-4 ml-6 ">
                        <StatusChip
                          statut={r.justifications[0]?.statut || null}
                        />
                        <Button
                          isIconOnly
                          aria-label="ouvrir réalisation"
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

                    <div className="block md:hidden">{r.description}</div>
                  </div>
                  <div className="px-5">
                    <Divider />
                  </div>
                </li>
              ))}
            </ul>
          </Tab>
          <Tab key="formation" title="Formation">
            <Divider className="mt-3" />
            {formations.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2 text-default-500 text-sm">
                <Icon className="text-4xl" icon="solar:book-bookmark-linear" />
                <p>Aucune formation pour ce badge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {formations.map((f) => (
                  <a
                    key={f.id}
                    className="group flex flex-col rounded-large border border-default-200 bg-content1 overflow-hidden hover:border-default-400 transition-colors"
                    href={f.lien}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-default-100">
                      <HeroImage
                        removeWrapper
                        alt={f.titre}
                        className="w-full h-full object-cover"
                        src={f.imageUrl}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="font-medium text-foreground line-clamp-2">
                        {f.titre}
                      </span>
                      <Icon
                        className="text-default-400 shrink-0 group-hover:text-foreground transition-colors"
                        icon="solar:arrow-right-up-linear"
                        width={20}
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
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
