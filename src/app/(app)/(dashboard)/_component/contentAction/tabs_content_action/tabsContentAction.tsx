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
        classNames={{
          tabList:
            "gap-1 md:gap-8 w-full max-w-[550px] rounded-full p-0.5 border-divider bg-dashboard-card",
          cursor:
            "!bg-nav-active rounded-full border border-dashboard-card md:before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-white before:text-lg before:font-bold",
          tab: "px2 md:px-6 h-12 relative md:text-sm text-xs ",
          tabContent:
            "text-black group-data-[selected=true]:text-white md:group-data-[selected=true]:pl-6 transition-all duration-300 ease-in-out",
        }}
        selectedKey={selectedKey as string}
        onSelectionChange={onSelectionChange}
      >
        <Tab key="objectif" title="Objectif" />
        <Tab
          key="notification"
          title={
            <div className="flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Chip color="danger" size="sm" variant="solid">
                  {unreadCount}
                </Chip>
              )}
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
