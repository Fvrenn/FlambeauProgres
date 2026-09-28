import { readFile } from "fs/promises";

import { prisma } from "@/lib/prisma";
import { REGLES_ICONE_ETAPE } from "@/lib/fichiers";
import { StorageService } from "@/services/storage.service";

const DOSSIER_ICONES = "etapes";
const ROUTE_ICONES = "/api/etapes/icones";
const NOM_ICONE_VALIDE = /^[a-z0-9-]+\.png$/;

export class EtapeIconeService {
  static async replace(etapeId: string, icone: File): Promise<void> {
    const { image_src: ancienneIcone } = await prisma.etape.findUniqueOrThrow({
      where: { id: etapeId },
      select: { image_src: true },
    });

    const { fileName } = await StorageService.uploadFile(
      nommerIcone(etapeId, icone),
      DOSSIER_ICONES,
      REGLES_ICONE_ETAPE,
    );

    await prisma.etape.update({
      where: { id: etapeId },
      data: { image_src: `${ROUTE_ICONES}/${fileName}` },
    });

    await supprimerIconeStockee(ancienneIcone);
  }

  static async read(nomFichier: string): Promise<Buffer | null> {
    if (!NOM_ICONE_VALIDE.test(nomFichier)) {
      return null;
    }

    try {
      return await readFile(
        StorageService.resolvePath(`${DOSSIER_ICONES}/${nomFichier}`),
      );
    } catch {
      return null;
    }
  }
}

function nommerIcone(etapeId: string, icone: File): File {
  return new File([icone], `etape-${etapeId}.png`, { type: icone.type });
}

async function supprimerIconeStockee(imageSrc: string | null): Promise<void> {
  const prefixe = `${ROUTE_ICONES}/`;

  if (imageSrc?.startsWith(prefixe)) {
    await StorageService.deleteFile(
      `${DOSSIER_ICONES}/${imageSrc.slice(prefixe.length)}`,
    );
  }
}
