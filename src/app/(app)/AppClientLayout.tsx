"use client";

import React from "react";
import { SidebarItem } from "@/components/application/sidebar/sidebar";
import { usePathname } from "next/navigation";
import { SidebarContent } from "@/components/application/sidebar/SidebarContent";
import { SidebarDrawer } from "@/components/application/sidebar/SidebarDrawer";
import { MobileNavbar } from "@/components/application/sidebar/MobileNavbar";

type AppClientLayoutProps = {
  children: React.ReactNode;
  user: any;
  sidebarItems: SidebarItem[];
};

export default function AppClientLayout({
  children,
  user,
  sidebarItems,
}: AppClientLayoutProps) {

  const pathname = usePathname();

  const activeItem = React.useMemo(() => {
    const findMatch = (items: SidebarItem[]): string | undefined => {
      for (const item of items) {
        if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
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

  const defaultSelectedKey = activeItem || pathname.split('/')[1] || 'dashboard';

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="h-screen min-h-[48rem] flex flex-col md:flex-row">
      <MobileNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

      <SidebarDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          onItemSelect={() => setIsMenuOpen(false)}
        />
      </SidebarDrawer>

      <div className="hidden md:flex lg:hidden h-full w-20 flex-col border-r-small border-divider z-20 bg-background transition-width duration-300">
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={true}
        />
      </div>

      <div className="hidden lg:flex xl:hidden h-full w-60 flex-col border-r-small border-divider transition-width duration-300">
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={false}
        />
      </div>

      <div className="hidden xl:flex h-full w-72 flex-col border-r-small border-divider transition-width duration-300">
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={false}
        />
      </div>

      <main className="flex-1 pt-0 md:pt-4 p-4 md:p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
