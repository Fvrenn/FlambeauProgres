"use client";

import type { SessionUser } from "@/types";
import type { Vue } from "@/lib/vue";

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
import { COOKIE_DERNIERE_VUE, vueDepuisChemin } from "@/lib/vue";

const UN_AN_EN_SECONDES = 60 * 60 * 24 * 365;

const SIDEBARS_FIXES = [
  {
    key: "compacte",
    className: "md:flex lg:hidden w-20 z-20",
    isCompact: true,
  },
  { key: "complete", className: "lg:flex w-60 xl:w-72", isCompact: false },
];

type AppClientLayoutProps = {
  children: React.ReactNode;
  user: SessionUser;
  sidebars: Record<Vue, SidebarItem[]>;
  vueMemorisee: Vue;
  mainClassName?: string;
  sidebarClassName?: string;
  navItemClassNames?: SidebarNavItemClassNames;
  contextSwitcherClassName?: string;
};

export default function AppClientLayout({
  children,
  user,
  sidebars,
  vueMemorisee,
  mainClassName,
  sidebarClassName,
  navItemClassNames,
  contextSwitcherClassName,
}: AppClientLayoutProps) {
  const pathname = usePathname();
  const vueDuChemin = vueDepuisChemin(pathname);
  const [derniereVue, setDerniereVue] = React.useState(vueMemorisee);

  if (vueDuChemin && vueDuChemin !== derniereVue) {
    setDerniereVue(vueDuChemin);
  }

  const sidebarItems = sidebars[vueDuChemin ?? derniereVue];
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

  const contenuSidebar = {
    contextSwitcherClassName,
    defaultSelectedKey,
    navItemClassNames,
    sidebarItems,
    user,
  };

  React.useEffect(() => {
    if (vueDuChemin) {
      document.cookie = `${COOKIE_DERNIERE_VUE}=${vueDuChemin}; path=/; max-age=${UN_AN_EN_SECONDES}; samesite=lax`;
    }
  }, [vueDuChemin]);

  return (
    <div className="h-screen min-h-[48rem] flex flex-col md:flex-row">
      <MobileNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

      <SidebarDrawer
        isOpen={isMenuOpen}
        panelClassName={sidebarSurfaceClasses}
        onClose={() => setIsMenuOpen(false)}
      >
        <SidebarContent
          {...contenuSidebar}
          onItemSelect={() => setIsMenuOpen(false)}
        />
      </SidebarDrawer>

      {SIDEBARS_FIXES.map(({ key, className, isCompact }) => (
        <div
          key={key}
          className={cn(
            "hidden h-full flex-col transition-width duration-300",
            className,
            sidebarSurfaceClasses,
          )}
        >
          <SidebarContent {...contenuSidebar} isCompact={isCompact} />
        </div>
      ))}

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
