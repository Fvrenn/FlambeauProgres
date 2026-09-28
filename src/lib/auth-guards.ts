import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { estReferent, suitEtapeSansAssignation } from "@/lib/roles";

export async function authorizeRole(...roles: UserRole[]) {
  const user = await getUser();

  if (!user || !("role" in user) || !roles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function exigerRole(...roles: UserRole[]) {
  const user = await authorizeRole(...roles);

  if (!user) {
    redirect("/");
  }

  return user;
}

export async function suitEtape(
  userId: string,
  role: UserRole | undefined,
  etapeId: string,
): Promise<boolean> {
  const etape = await prisma.etape.findUnique({
    where: { id: etapeId },
    select: { niveau: true },
  });

  return etape ? referentSuitEtape(userId, role, etapeId, etape.niveau) : false;
}

export async function canAccessJustification(
  userId: string,
  role: UserRole | undefined,
  justificationId: string,
): Promise<boolean> {
  const justification = await prisma.justification.findUnique({
    where: { id: justificationId },
    select: {
      chefId: true,
      etapeId: true,
      etape: { select: { niveau: true } },
    },
  });

  if (!justification) {
    return false;
  }

  if (justification.chefId === userId) {
    return true;
  }

  return referentSuitEtape(
    userId,
    role,
    justification.etapeId,
    justification.etape.niveau,
  );
}

async function referentSuitEtape(
  userId: string,
  role: UserRole | undefined,
  etapeId: string,
  niveau: number,
): Promise<boolean> {
  if (!estReferent(role)) {
    return false;
  }

  if (suitEtapeSansAssignation(role, niveau)) {
    return true;
  }

  const assignation = await prisma.etapeReferent.findFirst({
    where: { referentId: userId, etapeId },
  });

  return Boolean(assignation);
}
