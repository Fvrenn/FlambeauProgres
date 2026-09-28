import { prisma } from "@/lib/prisma";

export class FichierService {
  static async getById(id: string) {
    return prisma.fichier.findUnique({
      where: { id },
      select: {
        justificationId: true,
        cheminFichier: true,
        mimeType: true,
        nomOriginal: true,
      },
    });
  }
}
