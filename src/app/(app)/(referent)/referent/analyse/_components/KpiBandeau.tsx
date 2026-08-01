import type { Kpis } from "@/lib/analytics";

import React from "react";
import { Icon } from "@iconify/react";

import { Card, CardBody } from "@/components/ui";

function KpiCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Card className="bg-dashboard-panel">
      <CardBody className="gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-dashboard-card text-nav-active">
          <Icon icon={icon} width={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold leading-none">{value}</span>
          <span className="text-small text-default-500 mt-1">{label}</span>
          {hint ? (
            <span className="text-tiny text-default-400 mt-1">{hint}</span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function KpiBandeau({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        hint={`${kpis.realisations} réalisations · ${kpis.badges} badges`}
        icon="solar:check-circle-linear"
        label="Validations"
        value={kpis.total}
      />
      <KpiCard
        icon="solar:users-group-rounded-linear"
        label="Référents"
        value={kpis.referentsActifs}
      />
      <KpiCard
        icon="solar:user-linear"
        label="Chefs concernés"
        value={kpis.chefsConcernes}
      />
      <KpiCard
        icon="solar:flag-linear"
        label="Étapes concernées"
        value={kpis.etapesConcernees}
      />
    </div>
  );
}
