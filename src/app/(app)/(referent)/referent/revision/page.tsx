import React from "react";
import { redirect } from "next/navigation";

import RevisionClient from "./RevisionClient";

import { exigerRole, suitEtape } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import {
  messageRefusValidation,
  peutValiderEtape,
  ROLES_REFERENT,
} from "@/lib/roles";

type RevisionPageProps = {
  searchParams: Promise<{
    chefId?: string;
    etapeId?: string;
  }>;
};

export default async function RevisionPage({
  searchParams,
}: RevisionPageProps) {
  const user = await exigerRole(...ROLES_REFERENT);
  const params = await searchParams;
  const { chefId, etapeId } = params;

  if (!chefId || !etapeId) {
    redirect("/referent/dashboard");
  }

  if (!(await suitEtape(user.id, user.role, etapeId))) {
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

  const assignation = await prisma.etapeReferent.findFirst({
    where: { referentId: user.id, etapeId },
  });

  const peutValider = peutValiderEtape(
    user.role,
    etape.niveau,
    Boolean(assignation),
  );

  return (
    <RevisionClient
      chef={chef}
      etape={etape}
      justifications={justifications}
      peutValider={peutValider}
      refusValidation={messageRefusValidation(etape.niveau)}
    />
  );
}
