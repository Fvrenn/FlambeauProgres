import type { Kpis } from "@/lib/analytics";

import { StatCard } from "@/components/ui";

export function KpiBandeau({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        hint={`${kpis.realisations} réalisations · ${kpis.badges} badges`}
        icon="solar:check-circle-linear"
        label="Validations"
        value={kpis.total}
      />
      <StatCard
        icon="solar:users-group-rounded-linear"
        label="Référents"
        value={kpis.referentsActifs}
      />
      <StatCard
        icon="solar:user-linear"
        label="Chefs concernés"
        value={kpis.chefsConcernes}
      />
      <StatCard
        icon="solar:flag-linear"
        label="Étapes concernées"
        value={kpis.etapesConcernees}
      />
    </div>
  );
}
