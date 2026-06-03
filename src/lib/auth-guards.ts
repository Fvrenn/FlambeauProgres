import { UserRole } from "@prisma/client";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

/**
 * Renvoie l'utilisateur authentifié S'IL possède l'un des rôles demandés, sinon `null`.
 *
 * À appeler en PREMIÈRE ligne de chaque Server Action privilégiée : le `middleware`
 * et les `layout` ne protègent QUE le rendu des pages. Une Server Action est un
 * endpoint POST public — sans ce garde, n'importe quel utilisateur connecté peut
 * l'invoquer directement.
 */
export async function authorizeRole(...roles: UserRole[]) {
  const user = await getUser();

  if (!user || !("role" in user) || !roles.includes(user.role)) {
    return null;
  }

  return user;
}

/**
 * Indique si l'utilisateur a le droit de lire/écrire la justification donnée :
 * soit il en est le Chef propriétaire, soit il est Référent assigné à son Étape.
 */
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
