import { getUser } from "@/lib/auth-server";
import React from "react";
import AppClientLayout from "../AppClientLayout";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";
import { redirect } from "next/navigation";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le layout parent app/(app)/layout.tsx a déjà validé la session.
  // On récupère simplement l'utilisateur.
  const user = await getUser();

  // --- CORRECTION : Vérification de type robuste ---
  // On vérifie non seulement que l'utilisateur existe, mais aussi que la propriété 'role'
  // est présente avant de l'utiliser. Cela résout l'erreur TypeScript.
  // Une fois cette condition passée, TypeScript sait que `user` a bien un rôle et les propriétés associées.
  if (!user || !("role" in user) || user.role !== "REFERENT") {
    redirect("/dashboard"); // Rediriger vers une page sûre.
  }

  // --- MODIFICATION : Rendre le lien du tableau de bord dynamique ---
  // On définit une URL par défaut
  let dashboardHref = "/referent/dashboard";

  // Si l'utilisateur est référent d'au moins une étape,
  // on fait pointer le lien vers la première de la liste.
  if (user.etapesReferent && user.etapesReferent.length > 0) {
    dashboardHref = `/referent/dashboard?etapeId=${user.etapesReferent[0].id}`;
  }

  // Sidebar RÉFÉRENT
  const sidebarItems: SidebarItem[] = [
    {
      key: "referent", // <-- MODIFICATION ICI
      href: dashboardHref,
      icon: "solar:checklist-minimalistic-linear",
      title: "Justifications à valider",
    },
  ];

  return (
    <AppClientLayout user={user} sidebarItems={sidebarItems}>
      {children}
    </AppClientLayout>
  );
}