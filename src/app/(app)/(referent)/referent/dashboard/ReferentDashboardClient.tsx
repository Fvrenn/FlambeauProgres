"use client";

import type { JustificationSuivie, UserResume } from "@/types";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@heroui/react";

import ReferentValidationModal, {
  type ReferentThreadJustification,
} from "./_components/ReferentValidationModal";
import ReferentTabs, { type OngletReferent } from "./_components/ReferentTabs";
import JustificationsPanel from "./_components/panels/JustificationsPanel";
import RevisionPanel from "./_components/panels/RevisionPanel";

import { clickable } from "@/lib/a11y";
import { Icon } from "@/lib/icons";
import { Card, CardBody } from "@/components/ui";
import { type DiscussionViewer } from "@/components/discussion/DiscussionThread";

type StatTone = "default" | "warning" | "success";

const TONE_STYLES: Record<StatTone, string> = {
  default: "bg-dashboard-card text-nav-active",
  warning: "bg-warning/15 text-[#a67300]",
  success: "bg-success/15 text-[#127f51]",
};

function StatCard({
  icon,
  label,
  value,
  tone = "default",
  onSelect,
}: {
  icon: string;
  label: string;
  value: number;
  tone?: StatTone;
  onSelect: () => void;
}) {
  return (
    <Card isPressable className="bg-dashboard-panel" {...clickable(onSelect)}>
      <CardBody className="gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-full",
            TONE_STYLES[tone],
          )}
        >
          <Icon icon={icon} width={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold leading-none">{value}</span>
          <span className="text-small text-default-500 mt-1">{label}</span>
        </div>
      </CardBody>
    </Card>
  );
}

interface ReferentDashboardClientProps {
  justificationsAValider: JustificationSuivie[];
  justificationsEnAttente: JustificationSuivie[];
  chefsAReviser: UserResume[];
  targetJustificationId?: string;
  viewer: DiscussionViewer;
  peutEvaluer: boolean;
}

export default function ReferentDashboardClient({
  justificationsAValider,
  justificationsEnAttente,
  chefsAReviser,
  targetJustificationId,
  viewer,
  peutEvaluer,
}: ReferentDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OngletReferent>("a-valider");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] =
    useState<ReferentThreadJustification | null>(null);
  const deepLinkConsumed = useRef(false);

  useEffect(() => {
    if (deepLinkConsumed.current || !targetJustificationId) {
      return;
    }

    const aValider = justificationsAValider.find(
      (j) => j.id === targetJustificationId,
    );
    const enAttente = justificationsEnAttente.find(
      (j) => j.id === targetJustificationId,
    );
    const found = aValider ?? enAttente;

    if (found) {
      deepLinkConsumed.current = true;
      setActiveTab(aValider ? "a-valider" : "attente-du-chef");
      setSelectedJustification(found);
      setIsModalOpen(true);
    }
  }, [targetJustificationId, justificationsAValider, justificationsEnAttente]);

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
    "a-valider": (
      <JustificationsPanel
        justifications={justificationsAValider}
        liste="a-valider"
        onJustificationClick={handleJustificationClick}
      />
    ),
    "attente-du-chef": (
      <JustificationsPanel
        justifications={justificationsEnAttente}
        liste="attente-du-chef"
        onJustificationClick={handleJustificationClick}
      />
    ),
    "a-reviser": <RevisionPanel chefs={chefsAReviser} />,
  };

  return (
    <div className="h-full flex flex-col w-full md:pb-0 pb-20">
      <div className="flex-shrink-0 hidden md:flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-extrabold">Dashboard Référent</h1>
        <p className="text-default-500">
          Justifications et badges de vos chefs à traiter.
        </p>
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon="solar:clipboard-check-linear"
          label="Réalisations à valider"
          tone={justificationsAValider.length > 0 ? "warning" : "success"}
          value={justificationsAValider.length}
          onSelect={() => setActiveTab("a-valider")}
        />
        <StatCard
          icon="solar:clock-circle-linear"
          label="En attente du chef"
          value={justificationsEnAttente.length}
          onSelect={() => setActiveTab("attente-du-chef")}
        />
        <StatCard
          icon="solar:verified-check-linear"
          label="Badges complets à réviser"
          tone={chefsAReviser.length > 0 ? "warning" : "success"}
          value={chefsAReviser.length}
          onSelect={() => setActiveTab("a-reviser")}
        />
      </div>

      <div className="flex-shrink-0 mb-4">
        <ReferentTabs
          compteurs={{
            "a-valider": justificationsAValider.length,
            "attente-du-chef": justificationsEnAttente.length,
            "a-reviser": chefsAReviser.length,
          }}
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
        />
      </div>

      <div className="flex-1 h-full min-h-0 overflow-hidden flex flex-col">
        {contentMap[activeTab]}
      </div>

      <ReferentValidationModal
        isOpen={isModalOpen}
        justification={selectedJustification}
        peutEvaluer={peutEvaluer}
        viewer={viewer}
        onOpenChange={handleCloseModal}
      />
    </div>
  );
}
