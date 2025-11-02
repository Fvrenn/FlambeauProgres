"use client";

import { Etape, Objectif, Justification } from "@prisma/client";
import React, { useState, useEffect } from "react";
import ContentChemise from "./contentChemise/contentChemise";
import ContentAction from "./contentAction/contentAction";

// Nouveau type pour un objectif qui peut avoir une justification
export type ObjectifAvecJustification = Objectif & {
  justifications: Justification[]; // Sera un tableau de 0 ou 1 élément par notre requête
};

export type EtapeAvecObjectifs = Etape & {
  objectifs: ObjectifAvecJustification[];
};

interface DashboardClientProps {
  etapes: EtapeAvecObjectifs[];
}

export default function DashboardClient({ etapes: initialEtapes }: DashboardClientProps) {
  const [etapes, setEtapes] = useState<EtapeAvecObjectifs[]>(initialEtapes);
  const [selectedEtape, setSelectedEtape] = useState<EtapeAvecObjectifs | null>(null);
  const [activeTab, setActiveTab] = useState<React.Key>("progression");

  useEffect(() => {
    if (selectedEtape) {
      setActiveTab("objectif");
      // Synchroniser l'état de selectedEtape avec la source de vérité "etapes"
      const updatedSelectedEtape = etapes.find(e => e.id === selectedEtape.id) || null;
      setSelectedEtape(updatedSelectedEtape);
    } else {
      setActiveTab("progression");
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
                  ...justification 
                } as Justification;

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

  return (
    <div className="flex items-stretch flex-1 gap-4 pt-4 min-h-0">
      <ContentChemise
        etapes={etapes}
        selectedEtape={selectedEtape}
        onEtapeSelect={setSelectedEtape}
      />
      <ContentAction
        selectedEtape={selectedEtape}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUpdateJustification={updateJustification}
      />
    </div>
  );
}