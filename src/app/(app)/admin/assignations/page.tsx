import React from "react";

import AssignationsClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { ROLES_REFERENT, ROLES_ADMIN } from "@/lib/roles";

export default async function AdminAssignationsPage() {
  await exigerRole(...ROLES_ADMIN);

  const etapes = await prisma.etape.findMany({
    include: {
      referents: {
        include: {
          referent: true,
        },
      },
    },
    orderBy: {
      ordre: "asc",
    },
  });

  const allReferents = await prisma.user.findMany({
    where: {
      role: { in: ROLES_REFERENT },
    },
    orderBy: {
      name: "asc",
    },
  });

  return <AssignationsClientPage allReferents={allReferents} etapes={etapes} />;
}
