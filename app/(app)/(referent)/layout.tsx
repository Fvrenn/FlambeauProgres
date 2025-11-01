import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import AppClientLayout from "../AppClientLayout";
import { type SidebarItem } from "@/components/application/sidebar/sidebar";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: new Headers(headersList),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  if (!("role" in user) || user.role !== "REFERENT") {
    redirect("/dashboard");
  }

  // Sidebar RÉFÉRENT
  const sidebarItems: SidebarItem[] = [
    {
      key: "referent-dashboard",
      href: "/referent/dashboard",
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