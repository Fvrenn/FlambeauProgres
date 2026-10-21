import type { ChefAReviser } from "@/types";

import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";

interface RevisionPanelProps {
  chefs: ChefAReviser[];
}

export default function RevisionPanel({ chefs }: RevisionPanelProps) {
  return <ChefsAReviserList chefs={chefs} />;
}
