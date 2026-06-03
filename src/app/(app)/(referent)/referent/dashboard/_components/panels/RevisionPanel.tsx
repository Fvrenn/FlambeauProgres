import React from "react";
import { User } from "@prisma/client";

import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";

interface RevisionPanelProps {
  chefs: User[];
}

export default function RevisionPanel({ chefs }: RevisionPanelProps) {
  return (
    <div className="mt-2 md:mt-4">
      <ChefsAReviserList chefs={chefs} />
    </div>
  );
}
