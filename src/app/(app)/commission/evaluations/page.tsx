import ReferentDashboardClient from "@/components/application/referent/ReferentDashboardClient";
import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ESPACE_COMMISSION } from "@/lib/roles";
import { NotificationService } from "@/services/notification.service";
import { SuiviEtape3Service } from "@/services/suivi-etape3.service";

type EvaluationsPageProps = {
  searchParams: Promise<{ justification?: string }>;
};

export default async function EvaluationsPage({
  searchParams,
}: EvaluationsPageProps) {
  const user = await exigerRole(...ROLES_ESPACE_COMMISSION);
  const { justification } = await searchParams;

  const [
    { justificationsAEvaluer, justificationsEnAttente, peutEvaluer },
    signature,
    justificationCiblee,
  ] = await Promise.all([
    SuiviEtape3Service.getEvaluations(user.role),
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
        description="Réalisations de l'Étape 3 à évaluer : Experts, Formateur et Leader, tous chefs confondus."
        espace="commission"
        justificationCiblee={justificationCiblee}
        justificationsAValider={justificationsAEvaluer}
        justificationsEnAttente={justificationsEnAttente}
        peutEvaluer={peutEvaluer}
        titre="Évaluations"
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
