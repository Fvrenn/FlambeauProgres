import React from "react";
import { User } from "@prisma/client";

import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";

interface RevisionPanelProps {
  chefs: User[];
}

export default function RevisionPanel({ chefs }: RevisionPanelProps) {
  return <ChefsAReviserList chefs={chefs} />;
}
