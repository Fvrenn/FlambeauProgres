"use client";

import { Etape, Objectif } from "@prisma/client";
import React, { useState, useEffect } from "react";
import ContentChemise from "./contentChemise/contentChemise";
import ContentAction from "./contentAction/contentAction";

// On définit un type précis qui inclut la relation et qu'on pourra exporter
export type EtapeAvecObjectifs = Etape & {
  objectifs: Objectif[];
};

interface DashboardClientProps {
  etapes: EtapeAvecObjectifs[];
}

export default function DashboardClient({ etapes }: DashboardClientProps) {
  const [selectedEtape, setSelectedEtape] = useState<EtapeAvecObjectifs | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<React.Key>("progression");

  // Effet pour changer d'onglet automatiquement quand un badge est sélectionné
  useEffect(() => {
    if (selectedEtape) {
      setActiveTab("objectif");
    }
  }, [selectedEtape]);

  return (
    <div className="flex items-center flex-1 gap-4 pt-4">
      <ContentChemise
        etapes={etapes}
        selectedEtape={selectedEtape}
        onEtapeSelect={setSelectedEtape}
      />
      <ContentAction
        selectedEtape={selectedEtape}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}