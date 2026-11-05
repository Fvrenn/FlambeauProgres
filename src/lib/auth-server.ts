import { cache } from "react";

import { getCurrentUser as getWordpressUser } from "./wordpress-auth";

import { prisma } from "@/lib/prisma";

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

  return { ...user, etapesReferent };
});
