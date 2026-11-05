import type { EspaceSuivi } from "@/lib/espaces-suivi";
import type { PerimetreSuivi } from "@/services/suivi.service";

import React from "react";

import { ARemettre } from "./ARemettre";
import { EnAttente } from "./EnAttente";
import { Historique } from "./Historique";
import { SuiviOnglets } from "./SuiviOnglets";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { joursDepuis, lignesEnAttente, syntheseParEtape } from "@/lib/suivi";
import { SuiviService } from "@/services/suivi.service";

type SuiviValidationsProps = {
  perimetre: PerimetreSuivi;
  espace: EspaceSuivi;
  peutGerer: boolean;
  description: string;
  statistiques?: React.ReactNode;
};

export async function SuiviValidations({
  perimetre,
  espace,
  peutGerer,
  description,
  statistiques,
}: SuiviValidationsProps) {
  const [enAttente, aRemettre, remises, remisesExistantes] = await Promise.all([
    SuiviService.getEnAttente(perimetre),
    SuiviService.getARemettre(perimetre),
    SuiviService.getRemises(perimetre),
    peutGerer ? SuiviService.getRemisesExistantes() : [],
  ]);
  const maintenant = new Date();
  const lignes = lignesEnAttente(enAttente, espace).map((ligne) => ({
    ...ligne,
    jours: ligne.depuis ? joursDepuis(ligne.depuis, maintenant) : null,
  }));

  return (
    <>
      <RafraichissementArrierePlan />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold">Suivi</h1>
          <p className="text-default-500">{description}</p>
        </div>

        <SuiviOnglets
          aRemettre={
            <ARemettre
              badges={aRemettre}
              peutGerer={peutGerer}
              remisesExistantes={remisesExistantes}
            />
          }
          compteurs={{
            aEvaluer: enAttente.aEvaluer.length,
            enAttenteDuChef: enAttente.enAttenteDuChef.length,
            aValider: enAttente.aValider.length,
            aRemettre: aRemettre.length,
          }}
          enAttente={
            <EnAttente
              lignes={lignes}
              synthese={syntheseParEtape(enAttente.etapes, enAttente)}
            />
          }
          historique={
            <Historique
              peutGerer={peutGerer}
              remises={remises}
              statistiques={statistiques}
            />
          }
        />
      </div>
    </>
  );
}
