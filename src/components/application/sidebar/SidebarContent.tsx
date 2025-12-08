import React from "react";
import { ScrollShadow, Spacer } from "@heroui/react";
import Sidebar, { SidebarItem } from "./sidebar";
import Image from "next/image";
import ContextSwitcher from "./ContextSwitcher";

type SidebarContentProps = {
  user: any;
  sidebarItems: SidebarItem[];
  defaultSelectedKey: string;
};

export const SidebarContent = ({
  user,
  sidebarItems,
  defaultSelectedKey,
}: SidebarContentProps) => {
  return (
    <div className="flex h-full w-full flex-col p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <Image
          src="/logo/logo-flambeau-progres.svg"
          alt="Flambeau Progrès Logo"
          width={50}
          height={67}
          className="rounded-full"
        />
        <span className="text-2xl font-medium text-[#E06511] leading-7">
          Flambeau <span className="text-[#542C11]">Progrès</span>
        </span>
      </div>

      <Spacer y={8} />

      {/* ContextSwitcher */}
      <ContextSwitcher user={user} />

      {/* Sidebar List */}
      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar defaultSelectedKey={defaultSelectedKey} items={sidebarItems} />
      </ScrollShadow>
    </div>
  );
};
