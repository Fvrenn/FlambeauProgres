import React from "react";
import { redirect } from "next/navigation";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { adminSidebarItems, appShellClassNames } from "@/config/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={adminSidebarItems}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
