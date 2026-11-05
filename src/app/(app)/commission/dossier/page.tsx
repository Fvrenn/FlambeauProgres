import { DossierEtape3 } from "@/components/application/referent/DossierEtape3";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ESPACE_COMMISSION } from "@/lib/roles";

type DossierPageProps = {
  searchParams: Promise<{ chefId?: string; etapeId?: string }>;
};

export default async function DossierPage({ searchParams }: DossierPageProps) {
  const user = await exigerRole(...ROLES_ESPACE_COMMISSION);
  const { chefId, etapeId } = await searchParams;

  return (
    <DossierEtape3
      chefId={chefId}
      espace="commission"
      etapeId={etapeId}
      lecteur={user}
    />
  );
}
