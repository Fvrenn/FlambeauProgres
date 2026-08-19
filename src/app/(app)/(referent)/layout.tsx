import React from "react";
import { redirect } from "next/navigation";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { appShellClassNames, referentSidebarItems } from "@/config/navigation";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (
    !user ||
    !("role" in user) ||
    (user.role !== "REFERENT" && user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={referentSidebarItems(user)}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
