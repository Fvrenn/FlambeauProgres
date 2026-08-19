import { cache } from "react";

import { getCurrentUser as getWordpressUser } from "./wordpress-auth";

import { prisma } from "@/lib/prisma";

const getSession = cache(async () => {
  const user = await getWordpressUser();

  if (!user) {
    return null;
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

  return {
    session: null,
    user: {
      ...user,
      etapesReferent: assignations.map((assignation) => assignation.etape),
    },
  };
});

export const getUser = async () => {
  const session = await getSession();

  return session?.user;
};
