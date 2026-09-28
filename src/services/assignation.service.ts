import { prisma } from "@/lib/prisma";
import { USER_RESUME_SELECT } from "@/services/user.service";

export class AssignationService {
  static async listEtapesAvecReferents() {
    return prisma.etape.findMany({
      include: {
        referents: { include: { referent: { select: USER_RESUME_SELECT } } },
      },
      orderBy: { ordre: "asc" },
    });
  }

  static async assign(referentId: string, etapeId: string) {
    return prisma.etapeReferent.create({ data: { referentId, etapeId } });
  }

  static async remove(referentId: string, etapeId: string) {
    return prisma.etapeReferent.delete({
      where: { referentId_etapeId: { referentId, etapeId } },
    });
  }
}
