export const SANS_GROUPE = "__sans-groupe";

export const LIBELLE_SANS_GROUPE = "Sans groupe";

export type EffectifGroupe = { cle: string; libelle: string; total: number };

export function cleGroupe(groupe: string | null | undefined): string {
  return groupe?.trim() || SANS_GROUPE;
}

export function libelleGroupe(cle: string): string {
  return cle === SANS_GROUPE ? LIBELLE_SANS_GROUPE : cle;
}

export function compterParGroupe(
  membres: { groupe: string | null }[],
): EffectifGroupe[] {
  const totaux = new Map<string, number>();

  for (const membre of membres) {
    const cle = cleGroupe(membre.groupe);

    totaux.set(cle, (totaux.get(cle) ?? 0) + 1);
  }

  return [...totaux.entries()]
    .map(([cle, total]) => ({ cle, libelle: libelleGroupe(cle), total }))
    .sort((a, b) => {
      if (a.cle === SANS_GROUPE) return 1;
      if (b.cle === SANS_GROUPE) return -1;

      return b.total - a.total || a.libelle.localeCompare(b.libelle);
    });
}

export type OrigineGroupe = "TOUTES" | "APP" | "PLATEFORME";

export type ValidationsGroupe = {
  cle: string;
  libelle: string;
  app: number;
  plateforme: number;
};

export function agregerValidationsParGroupe(
  validations: { groupe: string | null; origine: "APP" | "PLATEFORME" }[],
  groupesConnus: (string | null)[],
): ValidationsGroupe[] {
  const parGroupe = new Map<string, ValidationsGroupe>();

  const obtenir = (groupe: string | null) => {
    const cle = cleGroupe(groupe);
    const existant = parGroupe.get(cle);

    if (existant) return existant;

    const cree = { cle, libelle: libelleGroupe(cle), app: 0, plateforme: 0 };

    parGroupe.set(cle, cree);

    return cree;
  };

  for (const groupe of groupesConnus) {
    obtenir(groupe);
  }

  for (const validation of validations) {
    const stat = obtenir(validation.groupe);

    if (validation.origine === "APP") {
      stat.app += 1;
    } else {
      stat.plateforme += 1;
    }
  }

  return [...parGroupe.values()];
}

export function classerGroupes(
  groupes: ValidationsGroupe[],
  origine: OrigineGroupe,
): EffectifGroupe[] {
  return groupes
    .map((groupe) => ({
      cle: groupe.cle,
      libelle: groupe.libelle,
      total:
        origine === "APP"
          ? groupe.app
          : origine === "PLATEFORME"
            ? groupe.plateforme
            : groupe.app + groupe.plateforme,
    }))
    .sort((a, b) => {
      if (a.cle === SANS_GROUPE) return 1;
      if (b.cle === SANS_GROUPE) return -1;

      return b.total - a.total || a.libelle.localeCompare(b.libelle);
    });
}
