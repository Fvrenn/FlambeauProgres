"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/react";
import JustificationsTable from "@/components/application/justifications-table/JustificationsTable";
import type { JustificationAvecRelations } from "@/components/application/justifications-table/JustificationsTableColumns";

type ReferentDashboardClientProps = {
  justificationsAValider: JustificationAvecRelations[];
};

export default function ReferentDashboardClient({
  justificationsAValider,
}: ReferentDashboardClientProps) {
  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0">
        Dashboard Référent
      </h4>

      <Tabs aria-label="Onglets du dashboard référent" className="mt-4">
        <Tab key="a-valider" title="Réalisations à valider">
          <JustificationsTable justifications={justificationsAValider} />
        </Tab>
        <Tab key="a-reviser" title="Badges complets à réviser">
          {/* Contenu de l'onglet 2 (Phase 4) */}
          <p className="p-4">
            Ici s'affichera la liste des chefs ayant complété cette étape.
          </p>
        </Tab>
      </Tabs>
    </div>
  );
}