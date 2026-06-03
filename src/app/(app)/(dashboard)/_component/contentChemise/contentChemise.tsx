"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { EtapeAvecObjectifs } from "../DashboardClient";
import "./CardEtapes.css";
import ContentAction from "../contentAction/contentAction";

import { Justification, Notification } from "@prisma/client";

const ChemiseModel = dynamic(
  () => import("./chemiseModel").then((mod) => mod.ChemiseModel),
  {
    ssr: false,
    loading: () => <p>Chargement du modèle...</p>,
  },
);

interface ContentChemiseProps {
  etapes: EtapeAvecObjectifs[];
  selectedEtape: EtapeAvecObjectifs | null;
  onEtapeSelect: (etape: EtapeAvecObjectifs | null) => void;
  activeTab: React.Key;
  onTabChange: (key: React.Key) => void;
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  targetSubTab: string | null;
}

export default function ContentChemise({
  etapes,
  selectedEtape,
  onEtapeSelect,
  activeTab,
  onTabChange,
  onUpdateJustification,
  notifications,
  unreadCount,
  onNotificationClick,
  targetSubTab,
}: ContentChemiseProps) {
  const handleBadgeClick = (etape: EtapeAvecObjectifs) => {
    const newSelection = selectedEtape?.id === etape.id ? null : etape;

    onEtapeSelect(newSelection);
  };

  return (
    <div className="md:bg-content1 h-full w-full md:w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="flex h-2/4 justify-center">
        <ChemiseModel selectedBadge={selectedEtape?.number} />
      </div>

      <div className=" md:bg-default w-full h-2/4 rounded-3xl border md:p-7 border-[#F0EFE7]">
        <div className="md:grid md:grid-cols-3 md:gap-4 gap-2 place-items-center flex overflow-x-auto md:px-4 px-0 mt-[-80px] md:mt-0 overflow-y-hidden py-2">
          {etapes.map((etape) => (
            <button
              key={etape.id}
              aria-label={`Sélectionner l'étape ${etape.name}`}
              className={`cursor-pointer opacity-100 md:opacity-50 holographic-card flex-shrink-0 ${
                selectedEtape?.id === etape.id ? "active" : ""
              }`}
              onClick={() => handleBadgeClick(etape)}
            >
              <Image
                alt={etape.name}
                className="w-[50px] h-auto md:w-[67px] md:h-[77px]"
                height={77}
                src={etape.image_src || ""}
                width={67}
              />
            </button>
          ))}
        </div>
        <div className="md:hidden flex-1 h-full w-full md:bg-white rounded-t-3xl md:p-4 overflow-y-auto">
          <ContentAction
            activeTab={activeTab}
            notifications={notifications}
            selectedEtape={selectedEtape}
            targetSubTab={targetSubTab}
            unreadCount={unreadCount}
            onNotificationClick={onNotificationClick}
            onTabChange={onTabChange}
            onUpdateJustification={onUpdateJustification}
          />
        </div>
      </div>
    </div>
  );
}
