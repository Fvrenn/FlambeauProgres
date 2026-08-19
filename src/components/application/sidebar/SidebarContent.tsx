import type { SessionUser } from "@/types";

import React from "react";
import { ScrollShadow, Spacer } from "@heroui/react";
import Image from "next/image";

import Sidebar, { SidebarItem, SidebarNavItemClassNames } from "./sidebar";
import ContextSwitcher from "./ContextSwitcher";

import { siteConfig } from "@/config/site";

type SidebarContentProps = {
  user: SessionUser;
  sidebarItems: SidebarItem[];
  defaultSelectedKey: string;
  isCompact?: boolean;
  onItemSelect?: (key: string) => void;
  navItemClassNames?: SidebarNavItemClassNames;
  contextSwitcherClassName?: string;
};

export const SidebarContent = ({
  user,
  sidebarItems,
  defaultSelectedKey,
  isCompact,
  onItemSelect,
  navItemClassNames,
  contextSwitcherClassName,
}: SidebarContentProps) => {
  return (
    <div
      className={`flex h-full w-full flex-col ${isCompact ? "p-2 items-center" : "p-6"}`}
    >
      <div
        className={`flex items-center gap-2 ${isCompact ? "justify-center" : "px-2"}`}
      >
        <Image
          alt="Flambeau Progrès Logo"
          className={`rounded-full h-auto ${isCompact ? "w-10" : "w-[50px]"}`}
          height={68}
          src="/logo/logo-flambeau-progres.svg"
          width={50}
        />
        {!isCompact && (
          <span className="text-2xl font-extrabold text-[#E06511] leading-7">
            Flambeaux <span className="text-[#542C11]">Progrès</span>
          </span>
        )}
      </div>

      <Spacer y={8} />

      <ContextSwitcher
        isCompact={isCompact}
        triggerClassName={contextSwitcherClassName}
        user={user}
      />

      <ScrollShadow
        className={`-mr-6 h-full max-h-full py-6 pr-6 ${isCompact ? "w-full" : ""}`}
      >
        <Sidebar
          defaultSelectedKey={defaultSelectedKey}
          isCompact={isCompact}
          items={sidebarItems}
          navItemClassNames={navItemClassNames}
          onItemSelect={onItemSelect}
        />
      </ScrollShadow>

      <footer
        className={`shrink-0 border-t border-dashboard-border pt-3 text-center text-tiny leading-tight text-default-400 ${
          isCompact ? "w-full px-1" : "px-2"
        }`}
      >
        {isCompact ? (
          <span>v{siteConfig.version}</span>
        ) : (
          <span>
            Développé par {siteConfig.author} - v{siteConfig.version}
          </span>
        )}
      </footer>
    </div>
  );
};
