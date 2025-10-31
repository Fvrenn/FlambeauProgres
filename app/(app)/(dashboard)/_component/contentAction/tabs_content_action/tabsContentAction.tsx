"use client";
import { Tabs, Tab } from "@heroui/react";
import React from "react";

interface TabsContentActionProps {
  selectedKey: React.Key;
  onSelectionChange: (key: React.Key) => void;
}

export default function TabsContentAction({
  selectedKey,
  onSelectionChange,
}: TabsContentActionProps) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selectedKey as string}
        onSelectionChange={onSelectionChange}
        classNames={{
          tabList: "gap-8 w-full max-w-[550px] rounded-full p-0.5 border-b border-divider bg-foreground",
          cursor: "!bg-white rounded-full border border-black before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
          tab: "px-6 h-12 relative",
          tabContent: "group-data-[selected=true]:text-black text-white group-data-[selected=true]:pl-6 transition-all duration-300 ease-in-out",
        }}
      >
        <Tab key="progression" title="Progression"></Tab>
        <Tab key="objectif" title="Objectif"></Tab>
        <Tab key="notification" title="Notifications"></Tab>
      </Tabs>
    </div>
  );
}