"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Justification, Notification } from "@prisma/client";

import { EtapeAvecObjectifs } from "../DashboardClient";
import "./CardEtapes.css";
import ContentAction from "../contentAction/contentAction";
import JalonBadge from "../JalonBadge";

const ChemiseModel = dynamic(
  () => import("./chemiseModel").then((mod) => mod.ChemiseModel),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full animate-pulse rounded-3xl bg-dashboard" />
    ),
  },
);

class ChemiseBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-default-500">
          Aperçu 3D indisponible
        </div>
      );
    }

    return this.props.children;
  }
}

interface ContentChemiseProps {
  etapes: EtapeAvecObjectifs[];
  currentJalon: EtapeAvecObjectifs | null;
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
  currentJalon,
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
    <div className="md:bg-dashboard-card h-full min-h-0 w-full md:w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="flex h-2/4 justify-center">
        <ChemiseBoundary>
          <ChemiseModel selectedBadge={selectedEtape?.number} />
        </ChemiseBoundary>
      </div>

      <div className="md:bg-dashboard w-full flex-1 min-h-0 md:h-2/4 md:flex-none rounded-3xl border md:p-7 border-dashboard-border flex flex-col">
        {currentJalon ? (
          <div className="flex h-full items-center justify-center py-2 mt-[-80px] md:mt-0">
            <JalonBadge key={currentJalon.id} jalon={currentJalon} />
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-4 gap-2 place-items-center flex overflow-x-auto md:px-4 px-0 mt-[-80px] md:mt-0 overflow-y-hidden py-2 flex-none">
            {etapes
              .filter((etape) => etape.type === "BADGE")
              .map((etape) => (
                <div key={etape.id} className="relative flex-shrink-0">
                  <button
                    aria-label={`Sélectionner l'étape ${etape.name}`}
                    className={`cursor-pointer opacity-100 holographic-card ${
                      etape.isValidated
                        ? "validated md:opacity-80"
                        : "md:opacity-50"
                    } ${selectedEtape?.id === etape.id ? "active" : ""}`}
                    onClick={() => handleBadgeClick(etape)}
                  >
                    {etape.image_src && (
                      <Image
                        alt={etape.name}
                        className="w-[50px] h-auto md:w-[67px] md:h-[77px]"
                        height={77}
                        sizes="(max-width: 768px) 50px, 67px"
                        src={etape.image_src}
                        width={67}
                      />
                    )}
                  </button>
                  {etape.isValidated && (
                    <Icon
                      aria-label="Badge validé"
                      className="absolute -top-1 -right-1 z-10 w-5 h-5 text-primary drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                      icon="solar:verified-check-bold"
                    />
                  )}
                </div>
              ))}
          </div>
        )}
        <div className="md:hidden flex-1 min-h-0 w-full md:bg-white rounded-t-3xl md:p-4 overflow-y-auto">
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
