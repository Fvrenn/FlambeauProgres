import React from 'react';
import TabsComponent, { TabData } from '../../../ui/Tabs';

export default function ControlPanelTabs() {
  const controlPanelTabs: TabData[] = [
    {
      id: "progression",
      label: "Progression",
      content: (
        <div>
          <h3>Votre Progression</h3>
        </div>
      )
    },
    {
      id: "objectifs",
      label: "Objectifs", 
      content: (
        <div>
          <h3>Vos Objectifs</h3>
        </div>
      )
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <div>
          <h3>Notifications</h3>
        </div>
      )
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
