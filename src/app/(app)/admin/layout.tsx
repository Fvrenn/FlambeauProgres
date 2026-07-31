import React from "react";
import { redirect } from "next/navigation";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || user.role !== "ADMIN") {
    redirect("/");
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: "dashboard",
      href: "/admin/dashboard",
      icon: "solar:home-2-linear",
      title: "Tableau de bord",
    },
    {
      key: "users",
      href: "/admin/users",
      icon: "solar:user-linear",
      title: "Utilisateurs",
    },
    {
      key: "etapes",
      href: "/admin/etapes",
      icon: "solar:flag-linear",
      title: "Etapes",
    },
    {
      key: "assignations",
      href: "/admin/assignations",
      icon: "solar:link-linear",
      title: "Assignations",
    },
    {
      key: "formations",
      href: "/admin/formations",
      icon: "solar:book-bookmark-linear",
      title: "Formation",
    },
  ];

  return (
    <AppClientLayout
      contextSwitcherClassName="bg-dashboard-card"
      mainClassName="bg-dashboard"
      navItemClassNames={{
        base: "data-[selected=true]:bg-nav-active data-[selected=true]:data-[hover=true]:bg-nav-hover data-[focus=true]:!bg-transparent data-[selected=true]:data-[focus=true]:!bg-nav-active",
        title:
          "text-small font-medium text-default-500 group-data-[selected=true]:text-white",
        icon: "text-default-500 group-data-[selected=true]:text-white",
      }}
      sidebarClassName="bg-sidebar border-r border-r-dashboard-border"
      sidebarItems={sidebarItems}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
