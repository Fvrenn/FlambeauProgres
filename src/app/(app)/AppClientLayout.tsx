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
  const defaultSelectedKey = pathname.split('/')[1] || 'dashboard'; // ex: /dashboard -> 'dashboard'

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
        />
      </SidebarDrawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col border-r-small border-divider">
        <SidebarContent 
            user={user} 
            sidebarItems={sidebarItems} 
            defaultSelectedKey={defaultSelectedKey} 
        />
      </div>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
