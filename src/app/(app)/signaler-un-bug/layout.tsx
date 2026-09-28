import React from "react";
import { cookies } from "next/headers";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { appShellClassNames } from "@/config/navigation";
import { COOKIE_DERNIERE_VUE, lireVue, sidebarItemsPourVue } from "@/lib/vue";

export default async function SignalerBugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const vue = lireVue((await cookies()).get(COOKIE_DERNIERE_VUE)?.value);

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={sidebarItemsPourVue(vue, user)}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
