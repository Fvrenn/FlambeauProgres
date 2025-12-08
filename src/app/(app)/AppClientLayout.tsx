// src/app/(app)/AppClientLayout.tsx
"use client";

import React from "react";
import { ScrollShadow, Spacer } from "@heroui/react";
import Sidebar, { SidebarItem } from "@/components/application/sidebar/sidebar";
import Image from "next/image";
import ContextSwitcher from "@/components/application/sidebar/ContextSwitcher";
import { usePathname } from "next/navigation";

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

  return (
    <div className="h-screen min-h-[48rem] flex">
      <div className="relative flex h-full w-72 flex-col border-r-small border-divider p-6">
        {/* Logo (Statique) */}
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

        {/* Le 'ContextSwitcher' (Client) reçoit 'user' (Serveur) */}
        <ContextSwitcher user={user} />

        {/* La 'Sidebar' (Client) reçoit 'sidebarItems' (Serveur) */}
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey={defaultSelectedKey}
            items={sidebarItems}
          />
        </ScrollShadow>
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}