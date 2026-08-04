import React from "react";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: "dashboard",
      href: "/",
      icon: "solar:home-2-linear",
      title: "Tableau de bord",
    },
  ];

  return (
    <AppClientLayout sidebarItems={sidebarItems} user={user}>
      {children}
    </AppClientLayout>
  );
}
