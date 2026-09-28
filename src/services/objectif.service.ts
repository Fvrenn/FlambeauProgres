import type { TypeObjectif } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ObjectifInput = {
  code: string;
  description: string;
  type: TypeObjectif;
  fichiersRequis: boolean;
  texteRequis: boolean;
};

export class ObjectifService {
  static async create(etapeId: string, data: ObjectifInput) {
    return prisma.objectif.create({ data: { etapeId, ...data } });
  }

  static async update(id: string, data: ObjectifInput) {
    return prisma.objectif.update({ where: { id }, data });
  }

  static async remove(id: string) {
    return prisma.objectif.delete({ where: { id } });
  }
}
