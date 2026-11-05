"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_GESTION_REMISES } from "@/lib/roles";
import { SuiviService } from "@/services/suivi.service";

const idSchema = z.string().min(1);

const marquerRemisSchema = z.object({
  statutIds: z.array(idSchema).min(1).max(500),
  remise: z.union([
    z.object({ remiseId: idSchema }),
    z.object({
      nom: z.string().trim().min(2).max(120),
      date: z.iso.date().transform((jour) => new Date(`${jour}T12:00:00Z`)),
    }),
  ]),
});

export async function marquerBadgesRemis(input: {
  statutIds: string[];
  remise: { remiseId: string } | { nom: string; date: string };
}) {
  try {
    const user = await authorizeRole(...ROLES_GESTION_REMISES);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = marquerRemisSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await SuiviService.marquerRemis({
      ...parsed.data,
      auteurId: user.id,
    });

    if (result.success) {
      revaliderSuivi();
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la remise:", error);

    return { success: false, error: "Erreur serveur" };
  }
}

export async function retirerBadgeDeRemise(statutId: string) {
  return gererRemise(statutId, SuiviService.retirerDeRemise);
}

export async function supprimerRemise(remiseId: string) {
  return gererRemise(remiseId, SuiviService.supprimerRemise);
}

async function gererRemise(
  id: string,
  operation: (id: string) => Promise<{ success: boolean; error?: string }>,
) {
  try {
    const user = await authorizeRole(...ROLES_GESTION_REMISES);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = idSchema.safeParse(id);

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await operation(parsed.data);

    if (result.success) {
      revaliderSuivi();
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la modification d'une remise:", error);

    return { success: false, error: "Erreur serveur" };
  }
}

function revaliderSuivi() {
  revalidatePath("/commission/suivi");
  revalidatePath("/coordination/suivi");
  revalidatePath("/referent/suivi");
}
