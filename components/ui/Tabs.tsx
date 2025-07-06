"use client";

import {Tabs, Tab} from "@heroui/tabs";

const themes = {
  dashboard: {
    tabList: "gap-8 w-full rounded-full p-0.5 border-b border-divider bg-medium-black",
    cursor: "!bg-white rounded-full border border-black before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
    tab: "px-6 h-12 relative",
    tabContent: "group-data-[selected=true]:text-black text-white group-data-[selected=true]:pl-6 transition-all duration-300 ease-in-out",
  },
};

interface TabData {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabData[];
  theme?: keyof typeof themes;
  ariaLabel?: string;
}

export default function TabsComponent({
  tabs,
  theme = "dashboard",
  ariaLabel = "Navigation tabs",
}: TabsComponentProps) {
  const currentTheme = themes[theme];

  return (
    <Tabs
      aria-label={ariaLabel}
      items={tabs}
      classNames={{
        tabList: currentTheme.tabList,
        cursor: currentTheme.cursor,
        tab: currentTheme.tab,
        tabContent: currentTheme.tabContent,
      }}
    >
      {(item) => (
        <Tab key={item.id} title={item.label}>
          {item.content}
        </Tab>
      )}
    </Tabs>
  );
}

export type { TabData };