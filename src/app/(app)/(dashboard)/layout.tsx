import React from "react";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { appShellClassNames, chefSidebarItems } from "@/config/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={chefSidebarItems}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
