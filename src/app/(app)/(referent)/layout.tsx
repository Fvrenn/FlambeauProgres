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
    redirect("/dashboard");
  }

  // --- MODIFICATION : Rendre le lien du tableau de bord dynamique ---

  let dashboardHref = "/referent/dashboard";

  if (user.etapesReferent && user.etapesReferent.length > 0) {
    dashboardHref = `/referent/dashboard?etapeId=${user.etapesReferent[0].id}`;
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: "referent", // <-- MODIFICATION ICI
      href: dashboardHref,
      icon: "solar:checklist-minimalistic-linear",
      title: "Justifications à valider",
    },
  ];

  return (
    <AppClientLayout sidebarItems={sidebarItems} user={user}>
      {children}
    </AppClientLayout>
  );
}
