import React from "react";
import { redirect } from "next/navigation";

import RevisionClient from "./RevisionClient";

import { exigerRole, suitEtape } from "@/lib/auth-guards";
import { messageRefusValidation, ROLES_REFERENT } from "@/lib/roles";
import { ReferentService } from "@/services/referent.service";

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

  const revision = await ReferentService.getRevision(chefId, etapeId, user);

  if (!revision) {
    redirect("/referent/dashboard");
  }

  const { chef, etape, justifications, peutValider } = revision;

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
