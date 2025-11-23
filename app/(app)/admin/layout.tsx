import { getUser } from "@/src/lib/auth-server";
import React from "react";
import AppClientLayout from "../AppClientLayout";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";
import { redirect } from "next/navigation";

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
      key: "troupes",
      href: "/admin/troupes",
      icon: "solar:users-group-rounded-linear",
      title: "Troupes",
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
      key: "objectifs",
      href: "/admin/objectifs",
      icon: "solar:target-linear",
      title: "Objectifs",
    },
    {
      key: "assignations",
      href: "/admin/assignations",
      icon: "solar:link-linear",
      title: "Assignations",
    },
  ];

  return (
    <AppClientLayout user={user} sidebarItems={sidebarItems}>
      {children}
    </AppClientLayout>
  );
}
