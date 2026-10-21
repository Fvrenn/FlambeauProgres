import React from "react";
import { redirect } from "next/navigation";

import AppClientLayout from "../AppClientLayout";

import { getUser } from "@/lib/auth-server";
import {
  NIVEAU_ETAPE_3,
  estReferent,
  suitEtapeSansAssignation,
} from "@/lib/roles";
import { ReferentService } from "@/services/referent.service";
import { appShellClassNames, referentSidebarItems } from "@/config/navigation";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || !estReferent(user.role)) {
    redirect("/");
  }

  const actionsExperts = suitEtapeSansAssignation(user.role, NIVEAU_ETAPE_3)
    ? await ReferentService.compterActionsExperts({
        id: user.id,
        role: user.role,
      })
    : 0;

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebarItems={referentSidebarItems(user, actionsExperts)}
      user={user}
    >
      {children}
    </AppClientLayout>
  );
}
