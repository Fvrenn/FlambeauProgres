// src/app/(app)/AppClientLayout.tsx
"use client";

import React from "react";
import { SidebarItem } from "@/components/application/sidebar/sidebar";
import { usePathname } from "next/navigation";
import { SidebarContent } from "@/components/application/sidebar/SidebarContent";
import { SidebarDrawer } from "@/components/application/sidebar/SidebarDrawer";
import { MobileNavbar } from "@/components/application/sidebar/MobileNavbar";

// (Remplace 'any' par ton vrai type User)
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

  // Trouve la clé de la page actuelle pour la sidebar
  const pathname = usePathname();

  // Find the active key by matching the pathname with sidebar items href
  // We assume deeper paths should match longer hrefs, but here we likely have exact or prefix matches.
  // Admin items: /admin/users -> key: users
  const activeItem = React.useMemo(() => {
    // Flatten items for search if needed, but for now top level seems enough or we recurse?
    // Admin items are flat. Referent items might be nested?
    // Let's implement a recursive search helper.
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
      {/* Mobile Navbar */}
      <MobileNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

      {/* Mobile Drawer (Overlay) */}
      <SidebarDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          onItemSelect={() => setIsMenuOpen(false)}
        />
      </SidebarDrawer>

      {/* Desktop Sidebar: Switches between 3 sizes based on breakpoints */}

      {/* 1. Compact (icons only) for Tablet/Small Desktop (md -> lg) */}
      <div className="hidden md:flex lg:hidden h-full w-20 flex-col border-r-small border-divider z-20 bg-background transition-width duration-300">
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={true}
        />
      </div>

      {/* 2. Intermediate (narrower) for Desktop (lg -> xl) */}
      <div className="hidden lg:flex xl:hidden h-full w-60 flex-col border-r-small border-divider transition-width duration-300">
        <SidebarContent
          user={user}
          sidebarItems={sidebarItems}
          defaultSelectedKey={defaultSelectedKey}
          isCompact={false}
        />
      </div>

      {/* 3. Full Size for Large Desktop (xl+) */}
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
