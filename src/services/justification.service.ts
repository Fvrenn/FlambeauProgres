import type { ServiceResult } from "@/types";
import type { Objectif, TypeObjectif } from "@prisma/client";

import { LIBELLE_TYPE_OBJECTIF } from "@/lib/justification";
import { prisma } from "@/lib/prisma";
import { competenceSoumiseAEvaluation } from "@/lib/roles";
import { EtapeService } from "@/services/etape.service";
import { NotificationService } from "@/services/notification.service";
import {
  DiscussionService,
  type FichierData,
} from "@/services/discussion.service";

const ETAPE_VERROUILLEE = "Cette étape n'est pas encore débloquée";
const TEXTE_OBLIGATOIRE = "La description est obligatoire pour cet objectif";

type Soumission = {
  chefId: string;
  chefName: string;
  objectifId: string;
  contenu: string;
};

export class JustificationService {
  static async submitCompetence(input: Soumission): Promise<ServiceResult> {
    const { chefId, chefName, objectifId } = input;

    const preparation = await preparerSoumission(input, "COMPETENCE");

    if (!preparation.success) {
      return preparation;
    }

    const { objectif, contenu: trimmed } = preparation.data;

    if (competenceSoumiseAEvaluation(objectif.etape.niveau)) {
      if (!trimmed) {
        return {
          success: false,
          error: "Décris ta compétence avant de la soumettre",
        };
      }

      return soumettreAEvaluation({
        chefId,
        chefName,
        objectif,
        contenu: trimmed,
        fichierData: null,
      });
    }

    const existing = await prisma.justification.findFirst({
      where: { objectifId, chefId },
    });

    if (existing) {
      await prisma.justification.update({
        where: { id: existing.id },
        data: {
          contenu: trimmed || null,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    } else {
      await prisma.justification.create({
        data: {
          objectifId,
          chefId,
          etapeId: objectif.etapeId,
          contenu: trimmed || null,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    }

    return { success: true };
  }

  static async submitRealisation(
    input: Soumission & { fichierData: FichierData | null },
  ): Promise<ServiceResult> {
    const { chefId, chefName, fichierData } = input;

    const preparation = await preparerSoumission(input, "REALISATION");

    if (!preparation.success) {
      return preparation;
    }

    const { objectif, contenu: trimmed } = preparation.data;

    if (!trimmed && !fichierData) {
      return { success: false, error: "Ajoute une description ou un fichier" };
    }

    return soumettreAEvaluation({
      chefId,
      chefName,
      objectif,
      contenu: trimmed,
      fichierData,
    });
  }
}

async function preparerSoumission(
  { chefId, objectifId, contenu }: Soumission,
  typeAttendu: TypeObjectif,
) {
  const objectif = await prisma.objectif.findUnique({
    where: { id: objectifId },
    include: { etape: { select: { niveau: true } } },
  });

  if (!objectif) {
    return { success: false as const, error: "Objectif non trouvé" };
  }

  if (objectif.type !== typeAttendu) {
    return {
      success: false as const,
      error: `Cet objectif n'est pas une ${LIBELLE_TYPE_OBJECTIF[typeAttendu]}`,
    };
  }

  if (!(await EtapeService.estAccessiblePourChef(chefId, objectif.etapeId))) {
    return { success: false as const, error: ETAPE_VERROUILLEE };
  }

  const trimmed = contenu.trim();

  if (objectif.texteRequis && !trimmed) {
    return { success: false as const, error: TEXTE_OBLIGATOIRE };
  }

  return { success: true as const, data: { objectif, contenu: trimmed } };
}

async function soumettreAEvaluation(input: {
  chefId: string;
  chefName: string;
  objectif: Objectif;
  contenu: string;
  fichierData: FichierData | null;
}): Promise<ServiceResult> {
  const { chefId, chefName, objectif, contenu, fichierData } = input;

  const existing = await prisma.justification.findFirst({
    where: { objectifId: objectif.id, chefId },
  });

  if (existing?.statut === "VALIDEE") {
    return {
      success: false,
      error: `Cette ${LIBELLE_TYPE_OBJECTIF[objectif.type]} est déjà validée`,
    };
  }

  const justificationId = await prisma.$transaction(async (tx) => {
    const justification = existing
      ? await tx.justification.update({
          where: { id: existing.id },
          data: {
            contenu: contenu || null,
            statut: "SOUMISE",
            soumiseAt: new Date(),
          },
        })
      : await tx.justification.create({
          data: {
            objectifId: objectif.id,
            chefId,
            etapeId: objectif.etapeId,
            contenu: contenu || null,
            statut: "SOUMISE",
            soumiseAt: new Date(),
          },
        });

    await DiscussionService.addMessage(tx, {
      justificationId: justification.id,
      auteurId: chefId,
      contenu: contenu || null,
      type: "USER",
      fichierData,
    });

    return justification.id;
  });

  await NotificationService.notifyReferentsOfNewJustification({
    etapeId: objectif.etapeId,
    justificationId,
    chefName,
    objectif,
  });

  return { success: true };
}
