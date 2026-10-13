import EtapesClientPage from "./ClientPage";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { EtapeAdminService } from "@/services/etape-admin.service";

export default async function AdminEtapesPage() {
  await exigerRole(...ROLES_ADMIN);

  const etapes = await EtapeAdminService.list();

  return (
    <>
      <RafraichissementArrierePlan />
      <EtapesClientPage etapes={etapes} />
    </>
  );
}
