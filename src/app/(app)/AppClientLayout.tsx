// src/app/(app)/AppClientLayout.tsx
"use client";

import React from "react";
import { SidebarItem } from "@/components/application/sidebar/sidebar";
import { usePathname } from "next/navigation";
import { SidebarContent } from "@/components/application/sidebar/SidebarContent";
import { Button, Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
      <Navbar 
        isBordered 
        className="md:hidden" 
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        maxWidth="full"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
          />
          <NavbarBrand className="gap-2">
             <Image
                src="/logo/logo-flambeau-progres.svg"
                alt="Flambeau Progrès Logo"
                width={32}
                height={43}
                className="rounded-full"
              />
              <span className="text-lg font-medium text-[#E06511] leading-7">
                Flambeau <span className="text-[#542C11]">Progrès</span>
              </span>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {isMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                    onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Drawer Content */}
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative flex h-full w-72 max-w-[80vw] flex-col bg-background border-r-small border-divider z-10"
                >
                    <Button 
                        isIconOnly 
                        variant="light" 
                        className="absolute top-2 right-2 z-50" 
                        onPress={() => setIsMenuOpen(false)}
                    >
                        <Icon icon="solar:close-circle-linear" width={24} />
                    </Button>
                    <SidebarContent 
                        user={user} 
                        sidebarItems={sidebarItems} 
                        defaultSelectedKey={defaultSelectedKey} 
                    />
                </motion.div>
            </div>
        )}
      </AnimatePresence>

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
