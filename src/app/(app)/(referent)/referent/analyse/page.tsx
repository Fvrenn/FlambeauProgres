import React from "react";
import { redirect } from "next/navigation";

import { ChartCard } from "./_components/ChartCard";
import { ClassementChart } from "./_components/ClassementChart";
import { FiltresBar } from "./_components/FiltresBar";
import { JournalTable } from "./_components/JournalTable";
import { KpiBandeau } from "./_components/KpiBandeau";

import { authorizeRole } from "@/lib/auth-guards";
import { parsePeriode } from "@/lib/analytics";
import { AnalyticsService } from "@/services/analytics.service";

type AnalysePageProps = {
  searchParams: Promise<{
    periode?: string;
    etapeId?: string;
    referentId?: string;
  }>;
};

export default async function AnalysePage({ searchParams }: AnalysePageProps) {
  const user = await authorizeRole("REFERENT", "ADMIN");

  if (!user) {
    redirect("/");
  }

  const params = await searchParams;
  const periode = parsePeriode(params.periode);
  const data = await AnalyticsService.getAnalytics({
    periode,
    etapeId: params.etapeId,
    referentId: params.referentId,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Analyse des validations</h1>
        <p className="text-default-500">
          Historique de ce qui a été validé, par qui et pour qui. Les
          compétences auto-validées par les chefs et les jalons automatiques ne
          sont pas comptés.
        </p>
      </div>

      <FiltresBar
        etapeId={params.etapeId}
        etapes={data.etapesDisponibles}
        periode={periode}
        referentId={params.referentId}
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
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Historique des validations</h2>
          <p className="text-tiny text-default-500">
            Qui a validé quoi, à qui et sur quelle étape.
          </p>
        </div>
        <JournalTable evenements={data.journal} />
      </div>
    </div>
  );
}
