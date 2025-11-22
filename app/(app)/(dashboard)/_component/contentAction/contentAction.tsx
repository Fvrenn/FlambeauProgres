"use client";
import React from "react";
import TabsContentAction from "./tabs_content_action/tabsContentAction";
import ProgressionPanel from "./panels/ProgressionPanel";
import ObjectifPanel from "./panels/ObjectifPanel";
import NotificationPanel from "./panels/NotificationPanel";
import { EtapeAvecObjectifs } from "../DashboardClient";
import { Justification, Notification } from "@prisma/client";

// Le type est maintenant importé, plus besoin de le définir localement.

interface ContentActionProps {
  selectedEtape: EtapeAvecObjectifs | null;
  activeTab: React.Key;
  onTabChange: (key: React.Key) => void;
  onUpdateJustification: (objectifId: string, justification: Partial<Justification>) => void;
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  targetSubTab: string | null;
}

export default function ContentAction({
  selectedEtape,
  activeTab,
  onTabChange,
  onUpdateJustification,
  notifications,
  unreadCount,
  onNotificationClick,
  targetSubTab,
}: ContentActionProps) {
  const contentMap: Record<string, React.ReactNode> = {
    objectif: <ObjectifPanel selectedEtape={selectedEtape} onUpdateJustification={onUpdateJustification} targetSubTab={targetSubTab} />,
    progression: <ProgressionPanel />,
    notification: <NotificationPanel notifications={notifications} onNotificationClick={onNotificationClick} />,
  };

  return (
    <div className="flex-1 h-full max-w-7xl flex flex-col gap-4 min-h-0">
      <div className="flex-shrink-0">
        <TabsContentAction
          selectedKey={activeTab}
          onSelectionChange={onTabChange}
          unreadCount={unreadCount}
        />
      </div>
      <div className="bg-white flex-1 w-full rounded-3xl p-6 overflow-y-auto min-h-0">
        {contentMap[activeTab as string]}
      </div>
    </div>
  );
}