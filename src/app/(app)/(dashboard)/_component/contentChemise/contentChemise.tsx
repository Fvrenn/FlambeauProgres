"use client";

import type { Branche } from "@/lib/wordpress-profile";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Justification, Notification } from "@prisma/client";

import { EtapeAvecObjectifs } from "../DashboardClient";
import "./CardEtapes.css";
import ObjectifPanel from "../contentAction/panels/ObjectifPanel";
import NotificationDrawer from "../contentAction/NotificationDrawer";
import JalonBadge from "../JalonBadge";

import ApercuChemise from "./ApercuChemise";
import GrilleBadges from "./GrilleBadges";

import { NIVEAU_PROFILS, NIVEAU_SPECIALITES } from "@/lib/parcours";
import { type DiscussionViewer } from "@/components/discussion/DiscussionThread";

const OBJECTIFS_OFFSET_REPOS = -24;
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
    return this.state.hasError ? null : this.props.children;
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
  const [estChemiseChargee, setEstChemiseChargee] = useState(false);
  const handleChemiseChargee = useCallback(
    () => setEstChemiseChargee(true),
    [],
  );

  const specialites = etapes.filter(
    (etape) => etape.type === "BADGE" && etape.niveau === NIVEAU_SPECIALITES,
  );
  const profils = etapes.filter(
    (etape) =>
      etape.type === "BADGE" &&
      etape.niveau === NIVEAU_PROFILS &&
      !etape.verrouille,
  );
  const livretProfils =
    etapes.find(
      (etape) =>
        etape.type === "JALON" &&
        etape.niveau === NIVEAU_PROFILS &&
        !etape.verrouille &&
        !etape.isValidated,
    ) ?? null;
  const etape3Disponible = profils.length > 0 || livretProfils !== null;
  const niveauActif = etape3Disponible ? niveauChoisi : NIVEAU_SPECIALITES;
  const livretAffiche = niveauActif === NIVEAU_PROFILS ? livretProfils : null;

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
    ? OBJECTIFS_OFFSET_REPOS
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

  const renderGrille = (badges: EtapeAvecObjectifs[]) => (
    <GrilleBadges
      badges={badges}
      selectedEtapeId={selectedEtape?.id}
      onBadgeClick={handleBadgeClick}
    />
  );

  const vues = [
    { niveau: NIVEAU_SPECIALITES, contenu: renderGrille(specialites) },
    ...(etape3Disponible
      ? [
          {
            niveau: NIVEAU_PROFILS,
            contenu: livretProfils ? (
              <div className="hidden items-center justify-center py-2 md:flex">
                <JalonBadge jalon={livretProfils} />
              </div>
            ) : (
              renderGrille(profils)
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="md:bg-dashboard-card h-full min-h-0 w-full md:w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="relative flex h-2/4 shrink-0 overflow-hidden justify-center md:h-auto md:min-h-0 md:flex-1 md:shrink">
        <ApercuChemise
          branche={branche}
          className={`transition-opacity duration-500 ${
            estChemiseChargee ? "opacity-0" : "opacity-100"
          }`}
        />
        <ChemiseBoundary>
          <ChemiseModel
            branche={branche}
            selectedBadge={selectedEtape?.number}
            onCharge={handleChemiseChargee}
          />
        </ChemiseBoundary>
      </div>

      <div
        className="bg-dashboard relative z-10 w-full flex-1 min-h-0 rounded-3xl border md:p-7 border-dashboard-border flex flex-col md:static md:z-auto md:flex-none md:pt-5 md:pb-2.5"
        style={{
          marginTop: isDesktop ? 0 : objectifsOffset,
          transition: "margin-top 300ms ease-out",
        }}
      >
        {currentJalon ? (
          <div className="grid flex-1">
            <div className="[grid-area:1/1] flex items-center justify-center py-2">
              <JalonBadge key={currentJalon.id} jalon={currentJalon} />
            </div>
            <div
              aria-hidden
              inert
              className="invisible hidden [grid-area:1/1] md:block"
            >
              {renderGrille(specialites)}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col mt-[-83px] md:mt-0 flex-none">
            {etape3Disponible && (
              <div
                aria-label="Choisir l’étape à afficher"
                className="absolute -top-10 left-1/2 z-20 inline-flex -translate-x-1/2 gap-1 rounded-full bg-dashboard-panel p-1 md:static md:mx-auto md:mb-3 md:translate-x-0"
                role="tablist"
              >
                {[NIVEAU_SPECIALITES, NIVEAU_PROFILS].map((niveau) => (
                  <button
                    key={niveau}
                    aria-selected={niveau === niveauActif}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
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
            )}

            <div className="grid">
              {vues.map(({ niveau, contenu }) => (
                <div
                  key={niveau}
                  aria-hidden={niveau !== niveauActif}
                  className={`[grid-area:1/1] flex min-w-0 flex-col justify-start ${
                    niveau === niveauActif ? "" : "invisible"
                  }`}
                >
                  {contenu}
                </div>
              ))}
            </div>
          </div>
        )}
        {!currentJalon && livretAffiche && (
          <div className="flex flex-1 items-center justify-center py-2 md:hidden">
            <JalonBadge key={livretAffiche.id} jalon={livretAffiche} />
          </div>
        )}
        {!currentJalon && !livretAffiche && (
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
