import prisma from "@/lib/prisma";

export type FormationInput = {
  titre: string;
  imageUrl: string;
  lien: string;
};

export class FormationService {
  static async list() {
    return prisma.formationCard.findMany({ orderBy: { createdAt: "asc" } });
  }

  static async create(data: FormationInput) {
    return prisma.formationCard.create({ data });
  }

  static async update(id: string, data: FormationInput) {
    return prisma.formationCard.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.formationCard.delete({
      where: { id },
    });
  }
}
