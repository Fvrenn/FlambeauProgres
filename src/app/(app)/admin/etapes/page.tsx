import React from "react";

import EtapesClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

export default async function AdminEtapesPage() {
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
