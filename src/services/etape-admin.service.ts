import type { ObjectifInput } from "@/services/objectif.service";

import { prisma } from "@/lib/prisma";

export type EtapeInfoInput = {
  number: string;
  name: string;
  description: string;
  ordre: number;
  wpValue: string | null;
};

export class EtapeAdminService {
  static async list() {
    return prisma.etape.findMany({
      include: { _count: { select: { objectifs: true } } },
      orderBy: { ordre: "asc" },
    });
  }

  static async getWithObjectifs(id: string) {
    return prisma.etape.findUnique({
      where: { id },
      include: { objectifs: { orderBy: { code: "asc" } } },
    });
  }

  static async create(info: EtapeInfoInput, objectifs: ObjectifInput[]) {
    return prisma.etape.create({
      data: { ...info, objectifs: { create: objectifs } },
      select: { id: true },
    });
  }

  static async update(id: string, info: EtapeInfoInput) {
    return prisma.etape.update({ where: { id }, data: info });
  }

  static async updateCouleur(id: string, couleur: string | null) {
    return prisma.etape.update({ where: { id }, data: { couleur } });
  }
}
