import React from "react";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import {
  allSidebarItemsForUser,
  appShellClassNames,
} from "@/config/navigation";

export default async function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={allSidebarItemsForUser(user)}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
