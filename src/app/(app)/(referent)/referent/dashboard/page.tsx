import ReferentDashboardClient from "./ReferentDashboardClient";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import { exigerRole, suitEtape } from "@/lib/auth-guards";
import { ROLES_REFERENT } from "@/lib/roles";
import { NotificationService } from "@/services/notification.service";
import { ReferentService } from "@/services/referent.service";

type ReferentDashboardPageProps = {
  searchParams: Promise<{
    etapeId?: string;
    justification?: string;
  }>;
};

export default async function ReferentDashboardPage({
  searchParams,
}: ReferentDashboardPageProps) {
  const user = await exigerRole(...ROLES_REFERENT);
  const params = await searchParams;
  const etapeId = params.etapeId;
  const targetJustificationId = params.justification;

  if (!etapeId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-default-500">
          Veuillez sélectionner une étape dans le menu de gauche pour commencer.
        </p>
      </div>
    );
  }

  if (!(await suitEtape(user.id, user.role, etapeId))) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-default-500">
          Vous ne suivez pas cette étape.
        </p>
      </div>
    );
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
    ReferentService.getDashboard(etapeId, user),
    NotificationService.getSignature(user.id),
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <RafraichissementSurNotification signature={signature} />
      <ReferentDashboardClient
        chefsAReviser={chefsAReviser}
        justificationsAValider={justificationsAValider}
        justificationsEnAttente={justificationsEnAttente}
        peutEvaluer={peutEvaluer}
        targetJustificationId={targetJustificationId}
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
