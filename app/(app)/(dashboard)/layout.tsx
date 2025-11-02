import { getUser } from "@/src/lib/auth-server";
import React from "react";
import AppClientLayout from "../AppClientLayout";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // On peut maintenant utiliser une fonction plus simple comme getUser()
  // car app/(app)/layout.tsx a déjà validé la session.
  const user = await getUser();

  // La redirection n'est plus nécessaire ici, le layout parent s'en est chargé.
  if (!user) {
    return null; // Ou un fallback, mais en théorie ce cas n'arrive jamais.
  }

  // Sidebar CHEF
  const sidebarItems: SidebarItem[] = [
    {
      key: "dashboard",
      href: "/dashboard",
      icon: "solar:home-2-linear",
      title: "Tableau de bord",
    },
    // @ts-ignore
    ...(user.troupeDirigee
      ? [
          {
            key: "commandes",
            href: "/troupe/commandes",
            icon: "solar:box-minimalistic-linear",
            title: "Commandes de Troupe",
          },
        ]
      : []),
  ];

  return (
    <AppClientLayout user={user} sidebarItems={sidebarItems}>
      {children}
    </AppClientLayout>
  );
}