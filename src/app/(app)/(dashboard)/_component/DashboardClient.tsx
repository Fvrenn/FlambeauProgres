"use client";

import {
  Etape,
  Objectif,
  Justification,
  Notification,
  FormationCard,
} from "@prisma/client";
import React, { useState, useEffect } from "react";

import ContentChemise from "./contentChemise/contentChemise";
import ContentAction from "./contentAction/contentAction";

import { markNotificationAsRead } from "@/actions/notification/notification.actions";

export type ObjectifAvecJustification = Objectif & {
  justifications: Justification[];
};

export type EtapeAvecObjectifs = Etape & {
  objectifs: ObjectifAvecJustification[];
  formations: FormationCard[];
  isValidated?: boolean;
};

interface DashboardClientProps {
  etapes: EtapeAvecObjectifs[];
  notifications: Notification[];
}

export default function DashboardClient({
  etapes: initialEtapes,
  notifications,
}: DashboardClientProps) {
  const [etapes, setEtapes] = useState<EtapeAvecObjectifs[]>(initialEtapes);

  const [lastInitialEtapes, setLastInitialEtapes] = useState(initialEtapes);

  if (initialEtapes !== lastInitialEtapes) {
    setLastInitialEtapes(initialEtapes);
    setEtapes(initialEtapes);
  }

  const [selectedEtape, setSelectedEtape] = useState<EtapeAvecObjectifs | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<React.Key>("objectif");
  const [targetSubTab, setTargetSubTab] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEtape) {
      setActiveTab("objectif");

      const updatedSelectedEtape =
        etapes.find((e) => e.id === selectedEtape.id) || null;

      setSelectedEtape(updatedSelectedEtape);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEtape?.id, etapes]);

  const updateJustification = (
    objectifId: string,
    justification: Partial<Justification>,
  ) => {
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape) => ({
        ...etape,
        objectifs: etape.objectifs.map((objectif) => {
          if (objectif.id === objectifId) {
            const existingJustification = objectif.justifications[0];
            const updatedJustification = existingJustification
              ? { ...existingJustification, ...justification }
              : ({
                  id: "temp-" + Date.now(),
                  ...justification,
                } as Justification);

            return {
              ...objectif,
              justifications: [updatedJustification],
            };
          }

          return objectif;
        }),
      })),
    );
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.lue) {
      await markNotificationAsRead(notification.id);
    }

    if (notification.justificationId) {
      const etapeFound = etapes.find((etape) =>
        etape.objectifs.some((obj) =>
          obj.justifications.some((j) => j.id === notification.justificationId),
        ),
      );

      if (etapeFound) {
        setSelectedEtape(etapeFound);
        setActiveTab("objectif");
        if (
          notification.type === "DEMANDE_PRECISION" ||
          notification.type === "NOUVEAU_COMMENTAIRE" ||
          notification.type === "REPONSE_PRECISION"
        ) {
          setTargetSubTab("realisations");
        } else {
          setTargetSubTab(null);
        }
      }
    }
  };

  return (
    <div className="flex items-stretch md:flex-1 gap-0 md:gap-4 md:pt-4 min-h-0 flex-auto md:flex-0">
      <ContentChemise
        activeTab={activeTab}
        etapes={etapes}
        notifications={notifications}
        selectedEtape={selectedEtape}
        targetSubTab={targetSubTab}
        unreadCount={notifications.filter((n) => !n.lue).length}
        onEtapeSelect={setSelectedEtape}
        onNotificationClick={handleNotificationClick}
        onTabChange={setActiveTab}
        onUpdateJustification={updateJustification}
      />
      <div className="hidden md:flex flex-1 h-full min-h-0">
        <ContentAction
          activeTab={activeTab}
          notifications={notifications}
          selectedEtape={selectedEtape}
          targetSubTab={targetSubTab}
          unreadCount={notifications.filter((n) => !n.lue).length}
          onNotificationClick={handleNotificationClick}
          onTabChange={setActiveTab}
          onUpdateJustification={updateJustification}
        />
      </div>
    </div>
  );
}
