import { getUser } from "@/lib/auth-server";
import React from "react";
import AppClientLayout from "../AppClientLayout";
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
      href: "/dashboard",
      icon: "solar:home-2-linear",
      title: "Tableau de bord",
    },
  ];

  return (
    <AppClientLayout user={user} sidebarItems={sidebarItems}>
      {children}
    </AppClientLayout>
  );
}