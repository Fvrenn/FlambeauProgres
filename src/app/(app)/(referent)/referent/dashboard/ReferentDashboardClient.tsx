"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/react";
import JustificationsTable from "@/components/application/justifications-table/JustificationsTable";
import type { JustificationAvecRelations } from "@/components/application/justifications-table/JustificationsTableColumns";
import ChefsAReviserTable from "@/components/application/referent/ChefsAReviserTable";
import { type User } from "@prisma/client";

type ReferentDashboardClientProps = {
  justificationsAValider: JustificationAvecRelations[];
  chefsAReviser: User[];
};

export default function ReferentDashboardClient({
  justificationsAValider,
  chefsAReviser,
}: ReferentDashboardClientProps) {
  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0 hidden md:block ">
        Dashboard Référent
      </h4>

      <Tabs aria-label="Onglets du dashboard référent" className="mt-4">
        <Tab key="a-valider" title="Réalisations à valider">
          <JustificationsTable justifications={justificationsAValider} />
        </Tab>
        <Tab key="a-reviser" title="Badges complets à réviser">
          <ChefsAReviserTable chefs={chefsAReviser} />
        </Tab>
      </Tabs>
    </div>
  );
}