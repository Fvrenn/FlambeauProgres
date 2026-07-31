"use client";

import type { SessionUser } from "@/types";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/react";

import {
  SidebarItem,
  SidebarNavItemClassNames,
} from "@/components/application/sidebar/sidebar";
import { SidebarContent } from "@/components/application/sidebar/SidebarContent";
import { SidebarDrawer } from "@/components/application/sidebar/SidebarDrawer";
import { MobileNavbar } from "@/components/application/sidebar/MobileNavbar";

type AppClientLayoutProps = {
  children: React.ReactNode;
  user: SessionUser;
  sidebarItems: SidebarItem[];
  mainClassName?: string;
  sidebarClassName?: string;
  navItemClassNames?: SidebarNavItemClassNames;
  contextSwitcherClassName?: string;
};

export default function AppClientLayout({
  children,
  user,
  sidebarItems,
  mainClassName,
  sidebarClassName,
  navItemClassNames,
  contextSwitcherClassName,
}: AppClientLayoutProps) {
  const pathname = usePathname();
  const sidebarSurfaceClasses =
    sidebarClassName ?? "bg-background border-r-small border-divider";

  const activeItem = React.useMemo(() => {
    const findMatch = (items: SidebarItem[]): string | undefined => {
      for (const item of items) {
        if (
          item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`))
        ) {
          return item.key;
        }
        if (item.items) {
          const nestedMatch = findMatch(item.items);

          if (nestedMatch) return nestedMatch;
        }
      }

      return undefined;
    };

    return findMatch(sidebarItems);
  }, [pathname, sidebarItems]);

  const defaultSelectedKey =
    activeItem || pathname.split("/")[1] || "dashboard";

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="h-screen min-h-[48rem] flex flex-col md:flex-row">
      <MobileNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

      <SidebarDrawer
        isOpen={isMenuOpen}
        panelClassName={sidebarSurfaceClasses}
        onClose={() => setIsMenuOpen(false)}
      >
        <SidebarContent
          contextSwitcherClassName={contextSwitcherClassName}
          defaultSelectedKey={defaultSelectedKey}
          navItemClassNames={navItemClassNames}
          sidebarItems={sidebarItems}
          user={user}
          onItemSelect={() => setIsMenuOpen(false)}
        />
      </SidebarDrawer>

      <div
        className={cn(
          "hidden md:flex lg:hidden h-full w-20 flex-col z-20 transition-width duration-300",
          sidebarSurfaceClasses,
        )}
      >
        <SidebarContent
          contextSwitcherClassName={contextSwitcherClassName}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={true}
          navItemClassNames={navItemClassNames}
          sidebarItems={sidebarItems}
          user={user}
        />
      </div>

      <div
        className={cn(
          "hidden lg:flex xl:hidden h-full w-60 flex-col transition-width duration-300",
          sidebarSurfaceClasses,
        )}
      >
        <SidebarContent
          contextSwitcherClassName={contextSwitcherClassName}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={false}
          navItemClassNames={navItemClassNames}
          sidebarItems={sidebarItems}
          user={user}
        />
      </div>

      <div
        className={cn(
          "hidden xl:flex h-full w-72 flex-col transition-width duration-300",
          sidebarSurfaceClasses,
        )}
      >
        <SidebarContent
          contextSwitcherClassName={contextSwitcherClassName}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={false}
          navItemClassNames={navItemClassNames}
          sidebarItems={sidebarItems}
          user={user}
        />
      </div>

      <main
        className={cn(
          "flex-1 pt-0 md:pt-4 p-4 md:p-6 overflow-y-auto",
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
