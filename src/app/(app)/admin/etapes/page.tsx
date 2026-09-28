import React from "react";

import EtapesClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function AdminEtapesPage() {
  await exigerRole(...ROLES_ADMIN);

  const etapes = await prisma.etape.findMany({
    include: {
      _count: {
        select: { objectifs: true },
      },
    },
    orderBy: {
      ordre: "asc",
    },
  });

  return <EtapesClientPage etapes={etapes} />;
}
