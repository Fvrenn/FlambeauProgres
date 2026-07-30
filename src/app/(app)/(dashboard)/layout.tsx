import React from "react";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: "dashboard",
      href: "/",
      icon: "solar:home-2-linear",
      title: "Tableau de bord",
    },
    {
      key: "progression",
      href: "/progression",
      icon: "solar:chart-2-linear",
      title: "Progression",
    },
    {
      key: "formation",
      href: "/formation",
      icon: "solar:book-bookmark-linear",
      title: "Formation",
    },
  ];

  return (
    <AppClientLayout sidebarItems={sidebarItems} user={user}>
      {children}
    </AppClientLayout>
  );
}
