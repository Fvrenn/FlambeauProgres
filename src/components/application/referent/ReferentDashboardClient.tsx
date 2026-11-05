"use client";

import type { ChefAReviser, JustificationSuivie } from "@/types";
import type { EspaceSuivi } from "@/lib/espaces-suivi";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ReferentValidationModal, {
  type ReferentThreadJustification,
} from "./ReferentValidationModal";
import ReferentTabs, { type OngletReferent } from "./ReferentTabs";
import JustificationsPanel from "./panels/JustificationsPanel";
import RevisionPanel from "./panels/RevisionPanel";

import { StatCard } from "@/components/ui";
import { type DiscussionViewer } from "@/components/discussion/DiscussionThread";

interface ReferentDashboardClientProps {
  titre: string;
  description: string;
  justificationsAValider?: JustificationSuivie[];
  justificationsEnAttente?: JustificationSuivie[];
  chefsAReviser?: ChefAReviser[];
  justificationCiblee: JustificationSuivie | null;
  viewer: DiscussionViewer;
  peutEvaluer: boolean;
  espace: EspaceSuivi;
}

export default function ReferentDashboardClient({
  titre,
  description,
  justificationsAValider,
  justificationsEnAttente,
  chefsAReviser,
  justificationCiblee,
  viewer,
  peutEvaluer,
  espace,
}: ReferentDashboardClientProps) {
  const router = useRouter();
  const compteurs: Partial<Record<OngletReferent, number>> = {
    ...(justificationsAValider && {
      "a-valider": justificationsAValider.length,
    }),
    ...(justificationsEnAttente && {
      "attente-du-chef": justificationsEnAttente.length,
    }),
    ...(chefsAReviser && { "a-reviser": chefsAReviser.length }),
  };
  const onglets = Object.keys(compteurs) as OngletReferent[];
  const [activeTab, setActiveTab] = useState<OngletReferent>(onglets[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] =
    useState<ReferentThreadJustification | null>(null);
  const deepLinkConsumed = useRef(false);

  useEffect(() => {
    if (deepLinkConsumed.current || !justificationCiblee) {
      return;
    }

    deepLinkConsumed.current = true;

    if (
      justificationCiblee.statut === "DEMANDE_PRECISION" &&
      justificationsEnAttente
    ) {
      setActiveTab("attente-du-chef");
    }

    setSelectedJustification(justificationCiblee);
    setIsModalOpen(true);
  }, [justificationCiblee, justificationsEnAttente]);

  const handleJustificationClick = (justification: JustificationSuivie) => {
    setSelectedJustification(justification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJustification(null);
    router.refresh();
  };

  const contentMap: Record<OngletReferent, React.ReactNode> = {
    "a-valider": justificationsAValider && (
      <JustificationsPanel
        justifications={justificationsAValider}
        liste="a-valider"
        onJustificationClick={handleJustificationClick}
      />
    ),
    "attente-du-chef": justificationsEnAttente && (
      <JustificationsPanel
        justifications={justificationsEnAttente}
        liste="attente-du-chef"
        onJustificationClick={handleJustificationClick}
      />
    ),
    "a-reviser": chefsAReviser && (
      <RevisionPanel chefs={chefsAReviser} espace={espace} />
    ),
  };

  return (
    <div className="h-full flex flex-col w-full md:pb-0 pb-20">
      <div className="flex-shrink-0 hidden md:flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-extrabold">{titre}</h1>
        <p className="text-default-500">{description}</p>
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {justificationsAValider && (
          <StatCard
            icon="solar:clipboard-check-linear"
            label="Réalisations à valider"
            tone={justificationsAValider.length > 0 ? "warning" : "success"}
            value={justificationsAValider.length}
            onSelect={() => setActiveTab("a-valider")}
          />
        )}
        {justificationsEnAttente && (
          <StatCard
            icon="solar:clock-circle-linear"
            label="En attente du chef"
            value={justificationsEnAttente.length}
            onSelect={() => setActiveTab("attente-du-chef")}
          />
        )}
        {chefsAReviser && (
          <StatCard
            icon="solar:verified-check-linear"
            label="Badges complets à réviser"
            tone={chefsAReviser.length > 0 ? "warning" : "success"}
            value={chefsAReviser.length}
            onSelect={() => setActiveTab("a-reviser")}
          />
        )}
      </div>

      {onglets.length > 1 && (
        <div className="flex-shrink-0 mb-4">
          <ReferentTabs
            compteurs={compteurs}
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
          />
        </div>
      )}

      <div className="flex-1 h-full min-h-0 overflow-hidden flex flex-col">
        {contentMap[activeTab]}
      </div>

      <ReferentValidationModal
        espace={espace}
        isOpen={isModalOpen}
        justification={selectedJustification}
        peutEvaluer={peutEvaluer}
        viewer={viewer}
        onOpenChange={handleCloseModal}
      />
    </div>
  );
}
