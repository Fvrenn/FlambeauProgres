"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages qui ne doivent pas avoir la navbar
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    // Layout pour les pages d'authentification (sans navbar)
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Layout normal avec navbar pour les autres pages
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="ml-64 container mx-auto pt-6 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
