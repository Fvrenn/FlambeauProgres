import type { ServiceResult } from "@/types";

import { prisma } from "@/lib/prisma";
import {
  etapeSeGereParAssignation,
  FILTRE_ETAPES_PAR_ASSIGNATION,
} from "@/lib/roles";
import { USER_RESUME_SELECT } from "@/services/user.service";

export class AssignationService {
  static async listEtapesAvecReferents() {
    return prisma.etape.findMany({
      where: FILTRE_ETAPES_PAR_ASSIGNATION,
      include: {
        referents: { include: { referent: { select: USER_RESUME_SELECT } } },
      },
      orderBy: { ordre: "asc" },
    });
  }

  static async assign(
    referentId: string,
    etapeId: string,
  ): Promise<ServiceResult> {
    const etape = await prisma.etape.findUnique({
      where: { id: etapeId },
      select: { type: true, niveau: true },
    });

    if (!etape || !etapeSeGereParAssignation(etape)) {
      return {
        success: false,
        error:
          "Cette étape ne se gère pas par assignation : l'étape 3 relève de la commission Formation et du Coordinateur National, les jalons se valident seuls",
      };
    }

    await prisma.etapeReferent.create({ data: { referentId, etapeId } });

    return { success: true };
  }

  static async remove(referentId: string, etapeId: string) {
    return prisma.etapeReferent.delete({
      where: { referentId_etapeId: { referentId, etapeId } },
    });
  }
}
