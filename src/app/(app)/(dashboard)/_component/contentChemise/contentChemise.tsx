"use client";

import type { Branche } from "@/lib/wordpress-profile";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Justification, Notification } from "@prisma/client";

import { EtapeAvecObjectifs } from "../DashboardClient";
import "./CardEtapes.css";
import ObjectifPanel from "../contentAction/panels/ObjectifPanel";
import NotificationDrawer from "../contentAction/NotificationDrawer";
import JalonBadge from "../JalonBadge";

import { Icon } from "@/lib/icons";
import { NIVEAU_PROFILS, NIVEAU_SPECIALITES } from "@/lib/parcours";
import { type DiscussionViewer } from "@/components/discussion/DiscussionThread";

const OBJECTIFS_OFFSET_SELECTED = -100;
const OBJECTIFS_OFFSET_EXPANDED = -200;
const OBJECTIFS_EXPAND_GAIN =
  OBJECTIFS_OFFSET_SELECTED - OBJECTIFS_OFFSET_EXPANDED;
const OBJECTIFS_EXPAND_THRESHOLD = OBJECTIFS_EXPAND_GAIN + 50;
const OBJECTIFS_COLLAPSE_THRESHOLD = 8;
const DESKTOP_QUERY = "(min-width: 768px)";

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
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  targetSubTab: string | null;
  viewer: DiscussionViewer;
  branche: Branche | null;
}

export default function ContentChemise({
  etapes,
  currentJalon,
  selectedEtape,
  onEtapeSelect,
  onUpdateJustification,
  notifications,
  unreadCount,
  onNotificationClick,
  targetSubTab,
  viewer,
  branche,
}: ContentChemiseProps) {
  const objectifsRef = useRef<HTMLDivElement>(null);
  const [isObjectifsExpanded, setIsObjectifsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [niveauChoisi, setNiveauChoisi] = useState<number>(NIVEAU_SPECIALITES);

  const specialites = etapes.filter(
    (etape) => etape.type === "BADGE" && etape.niveau === NIVEAU_SPECIALITES,
  );
  const profils = etapes.filter(
    (etape) =>
      etape.type === "BADGE" &&
      etape.niveau === NIVEAU_PROFILS &&
      !etape.verrouille,
  );
  const niveauActif = profils.length > 0 ? niveauChoisi : NIVEAU_SPECIALITES;
  const badgesAffiches = niveauActif === NIVEAU_PROFILS ? profils : specialites;

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setIsObjectifsExpanded(false);
    objectifsRef.current?.scrollTo({ top: 0 });
  }, [selectedEtape?.id]);

  const handleObjectifsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const { scrollTop } = element;

    if (!isObjectifsExpanded && scrollTop > OBJECTIFS_EXPAND_THRESHOLD) {
      setIsObjectifsExpanded(true);
      element.scrollTop = scrollTop - OBJECTIFS_EXPAND_GAIN;

      return;
    }

    if (isObjectifsExpanded && scrollTop < OBJECTIFS_COLLAPSE_THRESHOLD) {
      setIsObjectifsExpanded(false);
    }
  };

  const objectifsOffset = !selectedEtape
    ? 0
    : isObjectifsExpanded
      ? OBJECTIFS_OFFSET_EXPANDED
      : OBJECTIFS_OFFSET_SELECTED;

  const handleNiveauChange = (niveau: number) => {
    if (niveau === niveauActif) {
      return;
    }

    setNiveauChoisi(niveau);
    onEtapeSelect(null);
  };

  const handleBadgeClick = (etape: EtapeAvecObjectifs) => {
    const newSelection = selectedEtape?.id === etape.id ? null : etape;

    onEtapeSelect(newSelection);
  };

  return (
    <div className="md:bg-dashboard-card h-full min-h-0 w-full md:w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="flex h-2/4 shrink-0 overflow-hidden justify-center">
        <ChemiseBoundary>
          <ChemiseModel
            branche={branche}
            selectedBadge={selectedEtape?.number}
          />
        </ChemiseBoundary>
      </div>

      <div
        className="bg-dashboard relative z-10 w-full flex-1 min-h-0 rounded-3xl border md:p-7 border-dashboard-border flex flex-col md:static md:z-auto md:h-2/4 md:flex-none"
        style={{
          marginTop: isDesktop ? 0 : objectifsOffset,
          transition: "margin-top 300ms ease-out",
        }}
      >
        {currentJalon ? (
          <div className="flex flex-1 items-center justify-center py-2">
            <JalonBadge key={currentJalon.id} jalon={currentJalon} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-[-80px] md:mt-0 flex-none">
            {profils.length > 0 && (
              <div className="flex justify-center">
                <div
                  aria-label="Choisir l’étape à afficher"
                  className="inline-flex gap-0.5 rounded-full bg-dashboard-panel p-0.5"
                  role="tablist"
                >
                  {[NIVEAU_SPECIALITES, NIVEAU_PROFILS].map((niveau) => (
                    <button
                      key={niveau}
                      aria-selected={niveau === niveauActif}
                      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        niveau === niveauActif
                          ? "bg-dashboard-card text-foreground"
                          : "text-default-500 hover:text-foreground"
                      }`}
                      role="tab"
                      type="button"
                      onClick={() => handleNiveauChange(niveau)}
                    >
                      Étape {niveau}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="md:grid md:grid-cols-3 md:gap-4 gap-2 place-items-center flex overflow-x-auto md:px-4 px-0 overflow-y-hidden py-2">
              {badgesAffiches.map((etape) => (
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
                    {etape.image_src ? (
                      <Image
                        alt={etape.name}
                        className="w-[50px] h-auto md:w-[67px] md:h-[77px]"
                        height={77}
                        sizes="(max-width: 768px) 50px, 67px"
                        src={etape.image_src}
                        width={67}
                      />
                    ) : (
                      <span
                        className="flex w-[50px] h-[58px] md:w-[67px] md:h-[77px] items-center justify-center rounded-medium border border-dashboard-border text-sm font-semibold"
                        style={{ color: etape.couleur ?? undefined }}
                      >
                        {etape.number}
                      </span>
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
          </div>
        )}
        {!currentJalon && (
          <div
            ref={objectifsRef}
            className="md:hidden flex-1 min-h-0 w-full rounded-t-3xl px-3 pt-4 md:p-4 overflow-y-auto pb-24"
            onScroll={handleObjectifsScroll}
          >
            <ObjectifPanel
              selectedEtape={selectedEtape}
              targetSubTab={targetSubTab}
              viewer={viewer}
              onUpdateJustification={onUpdateJustification}
            />
          </div>
        )}
      </div>

      <NotificationDrawer
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick}
      />
    </div>
  );
}
