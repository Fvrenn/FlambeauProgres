import type { SessionUser } from "@/types";

import React from "react";
import { ScrollShadow, Spacer } from "@heroui/react";
import Image from "next/image";

import Sidebar, { SidebarItem } from "./sidebar";
import ContextSwitcher from "./ContextSwitcher";

type SidebarContentProps = {
  user: SessionUser;
  sidebarItems: SidebarItem[];
  defaultSelectedKey: string;
  isCompact?: boolean;
  onItemSelect?: (key: string) => void;
};

export const SidebarContent = ({
  user,
  sidebarItems,
  defaultSelectedKey,
  isCompact,
  onItemSelect,
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
          <span className="text-2xl font-medium text-[#E06511] leading-7">
            Flambeaux <span className="text-[#542C11]">Progrès</span>
          </span>
        )}
      </div>

      <Spacer y={8} />

      <ContextSwitcher isCompact={isCompact} user={user} />

      <ScrollShadow
        className={`-mr-6 h-full max-h-full py-6 pr-6 ${isCompact ? "w-full" : ""}`}
      >
        <Sidebar
          defaultSelectedKey={defaultSelectedKey}
          isCompact={isCompact}
          items={sidebarItems}
          onItemSelect={onItemSelect}
        />
      </ScrollShadow>
    </div>
  );
};
