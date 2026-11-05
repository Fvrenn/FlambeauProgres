import type { UserRole } from "@prisma/client";

import { redirect } from "next/navigation";

import RevisionClient from "@/components/application/referent/RevisionClient";
import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { type EspaceSuivi, lienRetourDossier } from "@/lib/espaces-suivi";
import { estNiveauEtape3 } from "@/lib/roles";
import { ReferentService } from "@/services/referent.service";

type DossierEtape3Props = {
  espace: Exclude<EspaceSuivi, "referent">;
  lecteur: { id: string; role: UserRole };
  chefId?: string;
  etapeId?: string;
};

export async function DossierEtape3({
  espace,
  lecteur,
  chefId,
  etapeId,
}: DossierEtape3Props) {
  const retour = lienRetourDossier(espace, etapeId ?? "");

  if (!chefId || !etapeId) {
    redirect(retour);
  }

  const revision = await ReferentService.getRevision(chefId, etapeId, lecteur);

  if (!revision || !estNiveauEtape3(revision.etape.niveau)) {
    redirect(retour);
  }

  const { chef, etape, objectifs, estComplet, peutValider, refusValidation } =
    revision;

  return (
    <>
      <RafraichissementArrierePlan />
      <RevisionClient
        chef={chef}
        espace={espace}
        estComplet={estComplet}
        etape={etape}
        objectifs={objectifs}
        peutValider={peutValider}
        refusValidation={refusValidation}
      />
    </>
  );
}
