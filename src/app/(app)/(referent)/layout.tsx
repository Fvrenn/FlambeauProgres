import React from "react";
import { redirect } from "next/navigation";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || user.role !== "REFERENT") {
    redirect("/");
  }

  let dashboardHref = "/referent/dashboard";

  if (user.etapesReferent && user.etapesReferent.length > 0) {
    dashboardHref = `/referent/dashboard?etapeId=${user.etapesReferent[0].id}`;
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: "referent",
      href: dashboardHref,
      icon: "solar:checklist-minimalistic-linear",
      title: "Justifications à valider",
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
