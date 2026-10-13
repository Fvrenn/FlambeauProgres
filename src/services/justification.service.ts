import type { ServiceResult } from "@/types";
import type { Objectif, TypeObjectif } from "@prisma/client";

import {
  LIBELLE_TYPE_OBJECTIF,
  MESSAGE_ETAPE_DEJA_VALIDEE,
  STATUTS_EN_ATTENTE,
} from "@/lib/justification";
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

  static async annuler(input: {
    chefId: string;
    justificationId: string;
  }): Promise<ServiceResult> {
    const { chefId, justificationId } = input;

    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: { objectif: { select: { type: true } } },
    });

    if (!justification || justification.chefId !== chefId) {
      return { success: false, error: "Justification introuvable" };
    }

    const libelle = LIBELLE_TYPE_OBJECTIF[justification.objectif.type];

    if (justification.statut === "VALIDEE") {
      return {
        success: false,
        error: `Cette ${libelle} a déjà été validée par ton évaluateur`,
      };
    }

    const estAutoValidee = justification.statut === "AUTO_VALIDEE";
    const estEnAttente = STATUTS_EN_ATTENTE.includes(justification.statut);

    if (!estAutoValidee && !estEnAttente) {
      return { success: false, error: `Cette ${libelle} n'est pas envoyée` };
    }

    if (await EtapeService.estValideePourChef(chefId, justification.etapeId)) {
      return { success: false, error: MESSAGE_ETAPE_DEJA_VALIDEE };
    }

    await prisma.$transaction(async (tx) => {
      if (estEnAttente) {
        await DiscussionService.addMessage(tx, {
          justificationId,
          auteurId: chefId,
          contenu: "↺ Soumission retirée par le chef",
          type: "SYSTEM",
        });
      }

      await tx.justification.update({
        where: { id: justificationId },
        data: { statut: "BROUILLON", soumiseAt: null, valideeAt: null },
      });
    });

    if (estEnAttente) {
      await NotificationService.supprimerPourEvaluateurs(
        justificationId,
        chefId,
      );
    }

    return { success: true };
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
