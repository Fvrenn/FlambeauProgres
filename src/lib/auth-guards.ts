import { UserRole } from "@prisma/client";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export async function authorizeRole(...roles: UserRole[]) {
  const user = await getUser();

  if (!user || !("role" in user) || !roles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function canAccessJustification(
  userId: string,
  role: UserRole | undefined,
  justificationId: string,
): Promise<boolean> {
  const justification = await prisma.justification.findUnique({
    where: { id: justificationId },
    select: { chefId: true, etapeId: true },
  });

  if (!justification) {
    return false;
  }

  if (justification.chefId === userId) {
    return true;
  }

  if (role === "REFERENT") {
    const assignation = await prisma.etapeReferent.findFirst({
      where: { referentId: userId, etapeId: justification.etapeId },
    });

    return Boolean(assignation);
  }

  return false;
}
