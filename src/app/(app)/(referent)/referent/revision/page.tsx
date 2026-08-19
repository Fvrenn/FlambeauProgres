import React from "react";
import { redirect } from "next/navigation";

import RevisionClient from "./RevisionClient";

import { prisma } from "@/lib/prisma";

type RevisionPageProps = {
  searchParams: Promise<{
    chefId?: string;
    etapeId?: string;
  }>;
};

export default async function RevisionPage({
  searchParams,
}: RevisionPageProps) {
  const params = await searchParams;
  const { chefId, etapeId } = params;

  if (!chefId || !etapeId) {
    redirect("/referent/dashboard");
  }

  const [chef, etape, justifications] = await Promise.all([
    prisma.user.findUnique({ where: { id: chefId } }),
    prisma.etape.findUnique({ where: { id: etapeId } }),
    prisma.justification.findMany({
      where: {
        chefId,
        etapeId,
        objectif: {
          type: "COMPETENCE",
        },
        statut: "AUTO_VALIDEE",
      },
      include: {
        objectif: true,
      },
      orderBy: {
        objectif: {
          code: "asc",
        },
      },
    }),
  ]);

  if (!chef || !etape) {
    redirect("/referent/dashboard");
  }

  return (
    <RevisionClient chef={chef} etape={etape} justifications={justifications} />
  );
}
