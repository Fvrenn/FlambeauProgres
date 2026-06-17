import React from "react";

import FormationsClientPage from "./ClientPage";

import { FormationService } from "@/services/formation.service";

export default async function AdminFormationsPage() {
  const formations = await FormationService.list();

  return <FormationsClientPage formations={formations} />;
}
