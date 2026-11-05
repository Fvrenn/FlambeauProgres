import React from "react";
import { cookies } from "next/headers";

import AppClientLayout from "./AppClientLayout";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { appShellClassNames } from "@/config/navigation";
import {
  NIVEAU_ETAPE_3,
  peutEvaluerEtape,
  peutValiderEtape,
} from "@/lib/roles";
import { COOKIE_DERNIERE_VUE, lireVue, sidebarsParVue } from "@/lib/vue";
import { SuiviEtape3Service } from "@/services/suivi-etape3.service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user)) {
    return redirectToLogin();
  }

  const [evaluations, validations, cookieStore] = await Promise.all([
    peutEvaluerEtape(user.role, NIVEAU_ETAPE_3, false)
      ? SuiviEtape3Service.compterEvaluations()
      : 0,
    peutValiderEtape(user.role, NIVEAU_ETAPE_3, false)
      ? SuiviEtape3Service.compterValidations()
      : 0,
    cookies(),
  ]);

  return (
    <AppClientLayout
      {...appShellClassNames}
      sidebars={sidebarsParVue(user, { evaluations, validations })}
      user={user}
      vueMemorisee={lireVue(cookieStore.get(COOKIE_DERNIERE_VUE)?.value)}
    >
      {children}
    </AppClientLayout>
  );
}
