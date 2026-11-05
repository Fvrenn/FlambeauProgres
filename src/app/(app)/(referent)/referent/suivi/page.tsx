import { SuiviValidations } from "@/components/suivi/SuiviValidations";
import { exigerRole } from "@/lib/auth-guards";
import { peutGererRemises, ROLES_REFERENT } from "@/lib/roles";

export default async function SuiviReferentPage() {
  const user = await exigerRole(...ROLES_REFERENT);

  return (
    <SuiviValidations
      description="Ce qui reste à traiter, les badges à remettre et l'historique des remises, pour les étapes qui vous sont assignées."
      espace="referent"
      perimetre={{
        etapeIds: (user.etapesReferent ?? []).map((etape) => etape.id),
      }}
      peutGerer={peutGererRemises(user.role)}
    />
  );
}
