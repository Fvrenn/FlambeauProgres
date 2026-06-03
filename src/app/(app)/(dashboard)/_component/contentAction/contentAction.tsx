"use client";
import React from "react";
import { Justification, Notification } from "@prisma/client";

import { EtapeAvecObjectifs } from "../DashboardClient";

import TabsContentAction from "./tabs_content_action/tabsContentAction";
import ObjectifPanel from "./panels/ObjectifPanel";
import NotificationPanel from "./panels/NotificationPanel";

interface ContentActionProps {
  selectedEtape: EtapeAvecObjectifs | null;
  activeTab: React.Key;
  onTabChange: (key: React.Key) => void;
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
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
    objectif: (
      <ObjectifPanel
        selectedEtape={selectedEtape}
        targetSubTab={targetSubTab}
        onUpdateJustification={onUpdateJustification}
      />
    ),
    notification: (
      <NotificationPanel
        notifications={notifications}
        onNotificationClick={onNotificationClick}
      />
    ),
  };

  return (
    <div className="flex-1 h-full max-w-7xl flex flex-col gap-4 min-h-0">
      <div className="flex-shrink-0">
        <TabsContentAction
          selectedKey={activeTab}
          unreadCount={unreadCount}
          onSelectionChange={onTabChange}
        />
      </div>
      <div className="bg-white flex-1 w-full rounded-3xl p-2 md:p-6 overflow-y-auto min-h-0 h-full">
        {contentMap[activeTab as string]}
      </div>
    </div>
  );
}
