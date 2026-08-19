import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "./auth";
import { getCurrentUser as getWordpressUser } from "./wordpress-auth";

import { prisma } from "@/lib/prisma";

const AUTH_PROVIDER = process.env.AUTH_PROVIDER ?? "better-auth";

const getBetterAuthSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

const getWordpressSession = cache(async () => {
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

const getSession = async () => {
  if (AUTH_PROVIDER === "wordpress") {
    return getWordpressSession();
  }

  return getBetterAuthSession();
};

export const getUser = async () => {
  const session = await getSession();

  return session?.user;
};
