"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { idSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { UserService } from "@/services/user.service";

export async function updateUserRole(userId: string, role: UserRole) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ userId: idSchema, role: z.nativeEnum(UserRole) })
    .safeParse({ userId, role });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await UserService.updateRole(parsed.data.userId, parsed.data.role);

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);

    return { success: false, error: "Échec de la mise à jour du rôle" };
  }
}
