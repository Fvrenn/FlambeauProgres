"use client";

import React, { useState } from "react";
import { type User, type Justification } from "@prisma/client";
import { useRouter } from "next/navigation";

import ReferentValidationModal, {
  type ReferentThreadJustification,
} from "./_components/ReferentValidationModal";
import ReferentTabs from "./_components/ReferentTabs";
import ValidationPanel from "./_components/panels/ValidationPanel";
import DiscussionPanel from "./_components/panels/DiscussionPanel";
import RevisionPanel from "./_components/panels/RevisionPanel";

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
};

type JustificationEnDiscussion = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
};

interface ReferentDashboardClientV2Props {
  justificationsAValider: JustificationAValider[];
  justificationsEnDiscussion: JustificationEnDiscussion[];
  chefsAReviser: User[];
}

export default function ReferentDashboardClientV2({
  justificationsAValider,
  justificationsEnDiscussion,
  chefsAReviser,
}: ReferentDashboardClientV2Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<React.Key>("a-valider");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] =
    useState<ReferentThreadJustification | null>(null);

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
    discussions: (
      <DiscussionPanel
        justifications={justificationsEnDiscussion}
        onJustificationClick={handleJustificationClick}
      />
    ),
    "a-reviser": <RevisionPanel chefs={chefsAReviser} />,
  };

  return (
    <div className="h-full flex flex-col w-full md:pb-0 pb-20">
      <h4 className="text-3xl font-normal flex-shrink-0 hidden md:block mb-6">
        Dashboard Référent
      </h4>

      <div className="flex-shrink-0 mb-4">
        <ReferentTabs
          discussionCount={justificationsEnDiscussion.length}
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
        onOpenChange={handleCloseModal}
      />
    </div>
  );
}
