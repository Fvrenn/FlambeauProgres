import React from "react";

import AssignationsClientPage from "./ClientPage";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { AssignationService } from "@/services/assignation.service";
import { UserService } from "@/services/user.service";

export default async function AdminAssignationsPage() {
  await exigerRole(...ROLES_ADMIN);

  const [etapes, allReferents] = await Promise.all([
    AssignationService.listEtapesAvecReferents(),
    UserService.listReferents(),
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <AssignationsClientPage allReferents={allReferents} etapes={etapes} />
    </>
  );
}
