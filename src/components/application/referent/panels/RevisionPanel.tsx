import type { ChefAReviser } from "@/types";
import type { EspaceSuivi } from "@/lib/espaces-suivi";

import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";

interface RevisionPanelProps {
  chefs: ChefAReviser[];
  espace: EspaceSuivi;
}

export default function RevisionPanel({ chefs, espace }: RevisionPanelProps) {
  return <ChefsAReviserList chefs={chefs} espace={espace} />;
}
