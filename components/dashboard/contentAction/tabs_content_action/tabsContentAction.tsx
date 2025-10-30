"use client";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
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
          tabList:
            "gap-5 rounded-full p-px border-b border-divider bg-foreground",
          cursor: "w-full bg-white rounded-full border border-black",
          tab: "max-w-fit px-0 h-12 group",
          tabContent:
            "group-data-[selected=true]:text-foreground text-white py-3.5 px-6",
        }}
      >
        <Tab
          key="progression"
          title={
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-foreground rounded-full opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
              Progression
            </div>
          }
        ></Tab>
        <Tab
          key="objectif"
          title={
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-foreground rounded-full opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
              Objectif
            </div>
          }
        ></Tab>
        <Tab
          key="notification"
          title={
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-foreground rounded-full opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
              Notifications
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
}