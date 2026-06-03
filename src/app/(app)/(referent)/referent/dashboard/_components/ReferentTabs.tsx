"use client";
import React from "react";
import { Tabs, Tab, Chip } from "@heroui/react";

interface ReferentTabsProps {
  selectedKey: React.Key;
  onSelectionChange: (key: React.Key) => void;
  validationCount: number;
  discussionCount: number;
  revisionCount: number;
}

export default function ReferentTabs({
  selectedKey,
  onSelectionChange,
  validationCount,
  discussionCount,
  revisionCount,
}: ReferentTabsProps) {
  return (
    <div className="w-full flex justify-center md:justify-start">
      <Tabs
        aria-label="Onglets du dashboard référent"
        classNames={{
          base: "w-full md:w-auto",
          tabList:
            "gap-2 md:gap-4 w-full md:w-fit max-w-full overflow-x-auto rounded-full p-1 bg-[#F3F2E9] scrollbar-hide",
          cursor: "!bg-danger-800 rounded-full shadow-sm",
          tab: "px-3 md:px-6 h-10 md:h-12 relative text-xs md:text-sm whitespace-nowrap",
          tabContent:
            "text-black group-data-[selected=true]:text-white group-data-[selected=true]:font-semibold font-medium transition-colors duration-300 ease-in-out",
        }}
        selectedKey={selectedKey as string}
        onSelectionChange={onSelectionChange}
      >
        <Tab
          key="a-valider"
          title={
            <div className="flex items-center gap-2">
              <span className="md:inline hidden">Réalisations à valider</span>
              <span className="md:hidden inline">Validations</span>
              {validationCount > 0 && (
                <Chip
                  className="h-5 min-w-5 px-1 text-[10px]"
                  color="danger"
                  size="sm"
                  variant="solid"
                >
                  {validationCount}
                </Chip>
              )}
            </div>
          }
        />
        <Tab
          key="discussions"
          title={
            <div className="flex items-center gap-2">
              <span className="md:inline hidden">Discussions en cours</span>
              <span className="md:hidden inline">Discussions</span>
              {discussionCount > 0 && (
                <Chip
                  className="h-5 min-w-5 px-1 text-[10px]"
                  color="warning"
                  size="sm"
                  variant="solid"
                >
                  {discussionCount}
                </Chip>
              )}
            </div>
          }
        />
        <Tab
          key="a-reviser"
          title={
            <div className="flex items-center gap-2">
              <span className="md:inline hidden">
                Badges complets à réviser
              </span>
              <span className="md:hidden inline">Révisions</span>
              {revisionCount > 0 && (
                <Chip
                  className="h-5 min-w-5 px-1 text-[10px]"
                  color="success"
                  size="sm"
                  variant="solid"
                >
                  {revisionCount}
                </Chip>
              )}
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
