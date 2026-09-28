const OCTETS_PAR_MO = 1024 * 1024;

export type ReglesFichier = {
  typesMime: readonly string[];
  tailleMaxOctets: number;
  typesAcceptes: string;
};

export type FichierAValider = {
  type: string;
  size: number;
};

export const REGLES_JUSTIFICATION: ReglesFichier = {
  typesMime: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  tailleMaxOctets: 8 * OCTETS_PAR_MO,
  typesAcceptes: "images, PDF ou Word",
};

export const REGLES_ICONE_ETAPE: ReglesFichier = {
  typesMime: ["image/png"],
  tailleMaxOctets: 1 * OCTETS_PAR_MO,
  typesAcceptes: "PNG",
};

export function validerFichier(
  fichier: FichierAValider,
  regles: ReglesFichier,
): string | null {
  if (!regles.typesMime.includes(fichier.type)) {
    return `Type de fichier non autorisé (${regles.typesAcceptes} uniquement)`;
  }

  if (fichier.size > regles.tailleMaxOctets) {
    return `Fichier trop volumineux (${toMegaOctets(regles.tailleMaxOctets)} Mo maximum)`;
  }

  return null;
}

export function toAttributAccept(regles: ReglesFichier): string {
  return regles.typesMime.join(",");
}

export function toMegaOctets(octets: number): number {
  return Math.round((octets / OCTETS_PAR_MO) * 10) / 10;
}
