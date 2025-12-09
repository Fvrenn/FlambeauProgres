"use client";

import { Etape, Objectif, Justification, Notification, Commentaire, User as UserType } from "@prisma/client";
import React, { useState, useEffect } from "react";
import ContentChemise from "./contentChemise/contentChemise";
import ContentAction from "./contentAction/contentAction";
import { markNotificationAsRead } from "@/actions/notification/notification.actions";

// Type pour un commentaire avec auteur
type CommentaireAvecAuteur = Commentaire & {
  auteur: UserType;
};

// Type pour une justification avec commentaires
type JustificationAvecCommentaires = Justification & {
  commentaires?: CommentaireAvecAuteur[];
};

// Nouveau type pour un objectif qui peut avoir une justification
export type ObjectifAvecJustification = Objectif & {
  justifications: JustificationAvecCommentaires[]; // Sera un tableau de 0 ou 1 élément par notre requête
};

export type EtapeAvecObjectifs = Etape & {
  objectifs: ObjectifAvecJustification[];
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
  const [selectedEtape, setSelectedEtape] = useState<EtapeAvecObjectifs | null>(null);
  const [activeTab, setActiveTab] = useState<React.Key>("objectif");
  const [targetSubTab, setTargetSubTab] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEtape) {
      setActiveTab("objectif");
      // Synchroniser l'état de selectedEtape avec la source de vérité "etapes"
      const updatedSelectedEtape = etapes.find(e => e.id === selectedEtape.id) || null;
      setSelectedEtape(updatedSelectedEtape);
    }
  }, [selectedEtape?.id, etapes]); // Dépendre de l'ID et de la liste principale

  // La fonction est maintenant plus simple
  const updateJustification = (objectifId: string, justification: Partial<Justification>) => {
    setEtapes(prevEtapes =>
      prevEtapes.map(etape => ({
        ...etape,
        objectifs: etape.objectifs.map(objectif => {
          if (objectif.id === objectifId) {
            const existingJustification = objectif.justifications[0];
            const updatedJustification = existingJustification
              ? { ...existingJustification, ...justification }
              : {
                id: 'temp-' + Date.now(),
                commentaires: [] as CommentaireAvecAuteur[],
                ...justification
              } as JustificationAvecCommentaires;

            return {
              ...objectif,
              justifications: [updatedJustification]
            };
          }
          return objectif;
        })
      }))
    );
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 1. Marquer comme lu
    if (!notification.lue) {
      await markNotificationAsRead(notification.id);
    }

    // 2. Trouver l'étape correspondante si la notification est liée à une justification
    if (notification.justificationId) {
      const etapeFound = etapes.find((etape) =>
        etape.objectifs.some((obj) =>
          obj.justifications.some((j) => j.id === notification.justificationId)
        )
      );

      if (etapeFound) {
        setSelectedEtape(etapeFound);
        setActiveTab("objectif");
        if (
          notification.type === "DEMANDE_PRECISION" ||
          notification.type === "NOUVEAU_COMMENTAIRE" ||
          notification.type === "REPONSE_PRECISION"
        ) {
          setTargetSubTab("discussion");
        } else {
          setTargetSubTab(null);
        }
      }
    }
  };

  return (
    <div className="flex items-stretch md:flex-1 gap-0 md:gap-4 md:pt-4 min-h-0 flex-auto md:flex-0">
      <ContentChemise
        etapes={etapes}
        selectedEtape={selectedEtape}
        onEtapeSelect={setSelectedEtape}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUpdateJustification={updateJustification}
        notifications={notifications}
        unreadCount={notifications.filter((n) => !n.lue).length}
        onNotificationClick={handleNotificationClick}
        targetSubTab={targetSubTab}
      />
      <div className="hidden md:flex flex-1 h-full min-h-0">
        <ContentAction
          selectedEtape={selectedEtape}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdateJustification={updateJustification}
          notifications={notifications}
          unreadCount={notifications.filter((n) => !n.lue).length}
          onNotificationClick={handleNotificationClick}
          targetSubTab={targetSubTab}
        />
      </div>
    </div>
  );
}