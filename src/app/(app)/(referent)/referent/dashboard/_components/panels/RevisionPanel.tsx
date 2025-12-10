import React from "react";
import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";
import { User } from "@prisma/client";

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
