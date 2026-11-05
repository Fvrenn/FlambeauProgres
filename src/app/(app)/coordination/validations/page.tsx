import ReferentDashboardClient from "@/components/application/referent/ReferentDashboardClient";
import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ESPACE_COORDINATION } from "@/lib/roles";
import { NotificationService } from "@/services/notification.service";
import { SuiviEtape3Service } from "@/services/suivi-etape3.service";

type ValidationsPageProps = {
  searchParams: Promise<{ justification?: string }>;
};

export default async function ValidationsPage({
  searchParams,
}: ValidationsPageProps) {
  const user = await exigerRole(...ROLES_ESPACE_COORDINATION);
  const { justification } = await searchParams;

  const [dossiersAValider, signature, justificationCiblee] = await Promise.all([
    SuiviEtape3Service.getDossiersAValider(),
    NotificationService.getSignature(user.id),
    justification
      ? SuiviEtape3Service.getJustificationSuivie(justification)
      : null,
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <RafraichissementSurNotification signature={signature} />
      <ReferentDashboardClient
        chefsAReviser={dossiersAValider}
        description="Dossiers de l'Étape 3 entièrement évalués par la commission Formation, à valider."
        espace="coordination"
        justificationCiblee={justificationCiblee}
        peutEvaluer={false}
        titre="Validations"
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
