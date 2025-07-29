import React from "react";
import TabsComponent, { TabData } from "../../../ui/Tabs";
import type { Badge } from "@/types/badge";
import Realisations from "./Realisations";
import Competences from "./Competences";
import "./tab.css";
interface ControlPanelTabsProps {
  badges: Badge[];
  selectedBadge: string | null;
}

export default function ControlPanelTabs({
  badges,
  selectedBadge,
}: ControlPanelTabsProps) {
  // Trouve le badge sélectionné dans les données complètes
  const currentBadge = badges.find((badge) => badge.number === selectedBadge);

  const controlPanelTabs: TabData[] = [
    {
      id: "progression",
      label: "Progression",
      content: (
        <div className="bg-white border border-border-beige-gris rounded-[23px] p-[14px] h-full tabs-container overflow-y-auto">
          <TabsComponent
            tabs={[
              {
                id: "1",
                label: "Compétences",
                content: <Competences badge={currentBadge} />,
              },
              {
                id: "2",
                label: "Réalisations",
                content: <Realisations badge={currentBadge} />,
              },
            ]}
            theme="progression"
          />
        </div>
      ),
    },
    {
      id: "objectifs",
      label: "Objectifs",
      content: (
        <div className="bg-white border border-border-beige-gris rounded-[23px] p-[14px]">
          <h3>Vos Objectifs</h3>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <div className="bg-white border border-border-beige-gris rounded-[23px] p-[14px]">
          <h3>Notifications</h3>
        </div>
      ),
    },
  ];

  return (
    <TabsComponent
      tabs={controlPanelTabs}
      theme="dashboard"
      ariaLabel="Panneau de contrôle scout"
    />
  );
}
