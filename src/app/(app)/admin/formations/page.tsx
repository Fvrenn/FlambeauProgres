import React from "react";

import FormationsClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { FormationService } from "@/services/formation.service";

export default async function AdminFormationsPage() {
  await exigerRole(...ROLES_ADMIN);

  const formations = await FormationService.list();

  return <FormationsClientPage formations={formations} />;
}
