"use client";

import { useState } from "react";
import { CardChemise } from "@/app/home/cardchemise/CardEtapes";
import ControlPanel from "@/app/home/cardcontrolpanel/ControlPanel";
import { useBadgesComplete } from "@/src/hooks/useBadgesComplete";

export default function HomeClient() {
  const { badges, isLoading, error } = useBadgesComplete();
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement.</p>;

  const handleBadgeSelect = (badgeNumber: string) => {
    setSelectedBadge(prev => prev === badgeNumber ? null : badgeNumber);
  };

  return (
    <div className="flex items-center h-[97.5dvh] gap-4 py-8 md:py-10">
      <CardChemise 
        onBadgeSelect={handleBadgeSelect}
        selectedBadge={selectedBadge}
      />
      <ControlPanel 
        badges={badges}
        selectedBadge={selectedBadge}
      />
    </div>
  );
}