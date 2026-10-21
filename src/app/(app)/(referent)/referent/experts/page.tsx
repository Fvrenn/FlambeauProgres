import { redirect } from "next/navigation";

import ReferentDashboardClient from "../dashboard/ReferentDashboardClient";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import { exigerRole } from "@/lib/auth-guards";
import {
  NIVEAU_ETAPE_3,
  ROLES_REFERENT,
  suitEtapeSansAssignation,
} from "@/lib/roles";
import { NotificationService } from "@/services/notification.service";
import { ReferentService } from "@/services/referent.service";

export default async function ExpertsPage() {
  const user = await exigerRole(...ROLES_REFERENT);

  if (!suitEtapeSansAssignation(user.role, NIVEAU_ETAPE_3)) {
    redirect("/referent/dashboard");
  }

  const [
    {
      chefsAReviser,
      justificationsAValider,
      justificationsEnAttente,
      peutEvaluer,
    },
    signature,
  ] = await Promise.all([
    ReferentService.getDashboardExperts(user),
    NotificationService.getSignature(user.id),
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <RafraichissementSurNotification signature={signature} />
      <ReferentDashboardClient
        chefsAReviser={chefsAReviser}
        description="Dossiers Expert de tous les chefs, toutes spécialités confondues."
        justificationCiblee={null}
        justificationsAValider={justificationsAValider}
        justificationsEnAttente={justificationsEnAttente}
        peutEvaluer={peutEvaluer}
        titre="Experts"
        viewer={{
          id: user.id,
          name: user.name,
          image: user.image ?? null,
          role: user.role,
        }}
      />
    </>
  );
}
