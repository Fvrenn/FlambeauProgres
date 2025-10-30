"use client";
import React from "react";
import TabsContentAction from "./tabs_content_action/tabsContentAction";
import ProgressionPanel from "./panels/ProgressionPanel";
import ObjectifPanel from "./panels/ObjectifPanel";
import NotificationPanel from "./panels/NotificationPanel";
import { EtapeAvecObjectifs } from "../DashboardClient";

// Le type est maintenant importé, plus besoin de le définir localement.

interface ContentActionProps {
  selectedEtape: EtapeAvecObjectifs | null;
  activeTab: React.Key;
  onTabChange: (key: React.Key) => void;
}

export default function ContentAction({
  selectedEtape,
  activeTab,
  onTabChange,
}: ContentActionProps) {
  const contentMap: Record<string, React.ReactNode> = {
    progression: <ProgressionPanel />,
    objectif: <ObjectifPanel selectedEtape={selectedEtape} />,
    notification: <NotificationPanel />,
  };

  return (
    <div className="flex-1 h-full max-w-7xl flex flex-col gap-4">
      <div>
        <TabsContentAction
          selectedKey={activeTab}
          onSelectionChange={onTabChange}
        />
      </div>
      <div className="bg-white flex-1 w-full rounded-3xl p-6">
        {contentMap[activeTab as string]}
      </div>
    </div>
  );
}