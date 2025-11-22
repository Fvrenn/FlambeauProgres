import React from "react";
import prisma from "@/src/lib/prisma";
import EtapesClientPage from "./ClientPage";

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
