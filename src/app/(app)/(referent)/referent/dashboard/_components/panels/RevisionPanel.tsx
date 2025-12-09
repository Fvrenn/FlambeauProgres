"use client";
import React from "react";
import ChefsAReviserTable from "@/components/application/referent/ChefsAReviserTable";
import { User } from "@prisma/client";

interface RevisionPanelProps {
  chefs: User[];
}

export default function RevisionPanel({ chefs }: RevisionPanelProps) {
  return (
    <div className="mt-2 md:mt-4">
      <ChefsAReviserTable chefs={chefs} />
    </div>
  );
}
