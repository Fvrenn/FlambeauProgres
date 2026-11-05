"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authorizeRole } from "@/lib/auth-guards";
import { getUser } from "@/lib/auth-server";
import { type EspaceSuivi, lienRetourDossier } from "@/lib/espaces-suivi";
import { estNiveauEtape3, estReferent, ROLES_REFERENT } from "@/lib/roles";
import { EtapeService } from "@/services/etape.service";

const validateEtapeSchema = z.object({
  chefId: z.string().min(1),
  etapeId: z.string().min(1),
});

export async function validateEtape(chefId: string, etapeId: string) {
  let espace: EspaceSuivi = "referent";

  try {
    const user = await getUser();

    if (!user || !("role" in user) || !estReferent(user.role)) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = validateEtapeSchema.safeParse({ chefId, etapeId });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await EtapeService.validateBadge({
      chefId: parsed.data.chefId,
      referentId: user.id,
      referentRole: user.role,
      etapeId: parsed.data.etapeId,
    });

    if (!result.success) {
      return result;
    }

    espace = estNiveauEtape3(result.data.niveau) ? "coordination" : "referent";
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Erreur lors de la validation finale de l'étape:", error);

    return { success: false, error: "Erreur serveur" };
  }

  redirect(lienRetourDossier(espace, etapeId));
}

const validerJalonSchema = z.object({
  etapeId: z.string().min(1),
});

export async function validerJalon(etapeId: string) {
  try {
    const user = await authorizeRole("CHEF", ...ROLES_REFERENT);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = validerJalonSchema.safeParse({ etapeId });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await EtapeService.autoValiderJalon(
      user.id,
      parsed.data.etapeId,
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/");
    revalidatePath("/progression");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la validation du jalon:", error);

    return { success: false, error: "Erreur serveur" };
  }
}
