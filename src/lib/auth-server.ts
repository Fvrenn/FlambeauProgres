import { cache } from "react";

import { getCurrentUser as getWordpressUser } from "./wordpress-auth";

import { prisma } from "@/lib/prisma";
import { NIVEAU_ETAPE_3, suitEtapeSansAssignation } from "@/lib/roles";

export const getUser = cache(async () => {
  const user = await getWordpressUser();

  if (!user) {
    return undefined;
  }

  const assignations = await prisma.etapeReferent.findMany({
    where: { referentId: user.id },
    select: {
      etape: {
        select: {
          id: true,
          name: true,
          image_src: true,
        },
      },
    },
  });

  const etapesReferent = assignations.map((assignation) => assignation.etape);

  if (suitEtapeSansAssignation(user.role, NIVEAU_ETAPE_3)) {
    const etapes3 = await prisma.etape.findMany({
      where: { niveau: { gte: NIVEAU_ETAPE_3 }, actif: true },
      orderBy: { ordre: "asc" },
      select: { id: true, name: true, image_src: true },
    });

    for (const etape of etapes3) {
      if (!etapesReferent.some((existante) => existante.id === etape.id)) {
        etapesReferent.push(etape);
      }
    }
  }

  return { ...user, etapesReferent };
});
