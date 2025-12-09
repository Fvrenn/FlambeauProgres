"use client";
import { Tabs, Tab, Chip } from "@heroui/react";
import React from "react";

interface TabsContentActionProps {
  selectedKey: React.Key;
  onSelectionChange: (key: React.Key) => void;
  unreadCount: number;
}

export default function TabsContentAction({
  selectedKey,
  onSelectionChange,
  unreadCount,
}: TabsContentActionProps) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selectedKey as string}
        onSelectionChange={onSelectionChange}
        classNames={{
          tabList: "gap-1 md:gap-8 w-full max-w-[550px] rounded-full p-0.5 border-b border-divider bg-foreground",
          cursor: "!bg-white rounded-full border border-black md:before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
          tab: "px2 md:px-6 h-12 relative text-sm md:text-xs",
          tabContent: "group-data-[selected=true]:text-black text-white md:group-data-[selected=true]:pl-6 transition-all duration-300 ease-in-out",
        }}
      >
        <Tab key="objectif" title="Objectif"></Tab>
        <Tab key="progression" title="Progression"></Tab>
        <Tab
          key="notification"
          title={
            <div className="flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Chip size="sm" color="danger" variant="solid">
                  {unreadCount}
                </Chip>
              )}
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
}