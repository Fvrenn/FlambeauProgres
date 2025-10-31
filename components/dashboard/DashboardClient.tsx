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

export default function DashboardClient({ etapes }: DashboardClientProps) {
  const [selectedEtape, setSelectedEtape] = useState<EtapeAvecObjectifs | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<React.Key>("progression");

  useEffect(() => {
    if (selectedEtape) {
      setActiveTab("objectif");
    }
  }, [selectedEtape]);

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
      />
    </div>
  );
}