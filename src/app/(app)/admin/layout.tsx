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
      key: "assignations",
      href: "/admin/assignations",
      icon: "solar:link-linear",
      title: "Assignations",
    },
  ];

  return (
    <AppClientLayout sidebarItems={sidebarItems} user={user}>
      {children}
    </AppClientLayout>
  );
}
