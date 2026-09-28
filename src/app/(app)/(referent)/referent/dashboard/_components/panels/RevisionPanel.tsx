import type { UserResume } from "@/types";

import React from "react";

import ChefsAReviserList from "@/components/application/referent/ChefsAReviserList";

interface RevisionPanelProps {
  chefs: UserResume[];
}

export default function RevisionPanel({ chefs }: RevisionPanelProps) {
  return <ChefsAReviserList chefs={chefs} />;
}
