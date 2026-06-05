import { getUser } from "@/lib/auth-server";
import React from "react";
import AppClientLayout from "../AppClientLayout";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";
import { redirect } from "next/navigation";

export default async function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
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
    <AppClientLayout user={user} sidebarItems={sidebarItems}>
      {children}
    </AppClientLayout>
  );
}
