"use client";

import React, { useEffect, useRef, useState } from "react";
import { type User, type Justification } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import ReferentValidationModal, {
  type ReferentThreadJustification,
} from "./_components/ReferentValidationModal";
import ReferentTabs from "./_components/ReferentTabs";
import ValidationPanel from "./_components/panels/ValidationPanel";
import RevisionPanel from "./_components/panels/RevisionPanel";

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
}: {
  icon: string;
  label: string;
  value: number;
  tone?: StatTone;
}) {
  return (
    <Card className="bg-dashboard-panel">
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

type ChefInfo = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type ObjectifInfo = {
  id: string;
  code: string;
  description: string;
};

type JustificationAValider = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
  messages: { auteurId: string }[];
};

type JustificationEnDiscussion = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
};

interface ReferentDashboardClientV2Props {
  justificationsAValider: JustificationAValider[];
  justificationsEnDiscussion: JustificationEnDiscussion[];
  chefsAReviser: User[];
  targetJustificationId?: string;
  viewer: DiscussionViewer;
}

export default function ReferentDashboardClientV2({
  justificationsAValider,
  justificationsEnDiscussion,
  chefsAReviser,
  targetJustificationId,
  viewer,
}: ReferentDashboardClientV2Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<React.Key>("a-valider");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] =
    useState<ReferentThreadJustification | null>(null);
  const deepLinkConsumed = useRef(false);

  useEffect(() => {
    if (deepLinkConsumed.current || !targetJustificationId) {
      return;
    }

    const inValider = justificationsAValider.find(
      (j) => j.id === targetJustificationId,
    );
    const inDiscussion = justificationsEnDiscussion.find(
      (j) => j.id === targetJustificationId,
    );
    const found = inValider ?? inDiscussion;

    if (found) {
      deepLinkConsumed.current = true;
      setActiveTab("a-valider");
      setSelectedJustification(found);
      setIsModalOpen(true);
    }
  }, [
    targetJustificationId,
    justificationsAValider,
    justificationsEnDiscussion,
  ]);

  const handleJustificationClick = (
    justification: JustificationAValider | JustificationEnDiscussion,
  ) => {
    setSelectedJustification(justification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJustification(null);
    router.refresh();
  };

  const contentMap: Record<string, React.ReactNode> = {
    "a-valider": (
      <ValidationPanel
        justifications={justificationsAValider}
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
        />
        <StatCard
          icon="solar:question-circle-linear"
          label="Demandes de précision en cours"
          value={justificationsEnDiscussion.length}
        />
        <StatCard
          icon="solar:verified-check-linear"
          label="Badges complets à réviser"
          tone={chefsAReviser.length > 0 ? "warning" : "success"}
          value={chefsAReviser.length}
        />
      </div>

      <div className="flex-shrink-0 mb-4">
        <ReferentTabs
          revisionCount={chefsAReviser.length}
          selectedKey={activeTab}
          validationCount={justificationsAValider.length}
          onSelectionChange={setActiveTab}
        />
      </div>

      <div className="flex-1 h-full min-h-0 overflow-hidden flex flex-col">
        {contentMap[activeTab as string]}
      </div>

      <ReferentValidationModal
        isOpen={isModalOpen}
        justification={selectedJustification}
        viewer={viewer}
        onOpenChange={handleCloseModal}
      />
    </div>
  );
}
