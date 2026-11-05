import type { AnalyticsFiltres } from "@/services/analytics.service";
import type { EspaceSuivi } from "@/lib/espaces-suivi";

import { ChartCard } from "./ChartCard";
import { ClassementChart } from "./ClassementChart";
import { ClassementGroupes } from "./ClassementGroupes";
import { FiltresBar } from "./FiltresBar";
import { JournalTable } from "./JournalTable";
import { KpiBandeau } from "./KpiBandeau";

import { AnalyticsService } from "@/services/analytics.service";

export async function AnalyseValidations({
  espace,
  filtres,
}: {
  espace: Exclude<EspaceSuivi, "referent">;
  filtres: AnalyticsFiltres;
}) {
  const [data, groupes] = await Promise.all([
    AnalyticsService.getAnalytics(filtres),
    AnalyticsService.getValidationsParGroupe(filtres),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Statistiques des validations</h2>
        <p className="text-tiny text-default-500">
          Historique de ce qui a été validé, par qui et pour qui. Les
          compétences auto-validées par les chefs et les jalons automatiques ne
          sont pas comptés.
        </p>
      </div>

      <FiltresBar
        etapeId={filtres.etapeId}
        etapes={data.etapesDisponibles}
        periode={filtres.periode}
        referentId={filtres.referentId}
        referents={data.referentsDisponibles}
      />

      <KpiBandeau kpis={data.kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          description="Nombre de validations enregistrées sur chaque étape."
          title="Étapes les plus validées"
        >
          <ClassementChart
            data={data.parEtape}
            messageVide="Aucune étape validée sur cette période"
          />
        </ChartCard>

        <ChartCard
          description="Nombre de validations enregistrées par chaque référent."
          title="Qui valide le plus"
        >
          <ClassementChart
            data={data.parReferent}
            messageVide="Aucun référent actif sur cette période"
          />
        </ChartCard>

        <ChartCard
          className="bg-dashboard-panel xl:col-span-2"
          description="Étapes validées par les chefs de chaque groupe, de celui qui en a le plus à celui qui en a le moins. Les étapes importées de la plateforme n'ont pas de date de validation : elles sont comptées quelle que soit la période, et exclues quand un référent est sélectionné."
          title="Étapes validées par groupe"
        >
          <ClassementGroupes groupes={groupes} />
        </ChartCard>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Historique des validations</h2>
          <p className="text-tiny text-default-500">
            Qui a validé quoi, à qui et sur quelle étape.
          </p>
        </div>
        <JournalTable espace={espace} evenements={data.journal} />
      </div>
    </section>
  );
}
