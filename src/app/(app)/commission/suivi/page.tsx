import { AnalyseValidations } from "@/components/analyse/AnalyseValidations";
import { SuiviValidations } from "@/components/suivi/SuiviValidations";
import { exigerRole } from "@/lib/auth-guards";
import { parsePeriode } from "@/lib/analytics";
import { peutGererRemises, ROLES_ESPACE_COMMISSION } from "@/lib/roles";

type SuiviPageProps = {
  searchParams: Promise<{
    periode?: string;
    etapeId?: string;
    referentId?: string;
  }>;
};

export default async function SuiviPage({ searchParams }: SuiviPageProps) {
  const user = await exigerRole(...ROLES_ESPACE_COMMISSION);
  const params = await searchParams;

  return (
    <SuiviValidations
      description="Ce qui reste à traiter, les badges à remettre et l'historique des remises, pour toutes les étapes."
      espace="commission"
      perimetre="tout"
      peutGerer={peutGererRemises(user.role)}
      statistiques={
        <AnalyseValidations
          espace="commission"
          filtres={{
            periode: parsePeriode(params.periode),
            etapeId: params.etapeId,
            referentId: params.referentId,
          }}
        />
      }
    />
  );
}
