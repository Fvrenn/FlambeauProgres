import { tableauCsv } from "@/lib/csv";
import {
  type EspaceSuivi,
  lienDiscussion,
  lienDossier,
} from "@/lib/espaces-suivi";
import { estNiveauEtape3 } from "@/lib/roles";

const UN_JOUR_MS = 24 * 60 * 60 * 1000;

export const SANS_GROUPE = "Sans groupe";

export type EtapeSuivie = { id: string; name: string; niveau: number };

export type LigneSynthese = EtapeSuivie & {
  aEvaluer: number;
  enAttenteDuChef: number;
  aValider: number;
};

export type TypeAttente = "a-evaluer" | "attente-chef" | "a-valider";

export type ChefSuivi = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  groupe: string | null;
};

export type LigneAttente = {
  id: string;
  type: TypeAttente;
  chef: ChefSuivi;
  etape: EtapeSuivie;
  objet: string;
  depuis: Date | null;
  lien: string | null;
};

type JustificationEnAttente = {
  id: string;
  soumiseAt: Date | null;
  updatedAt: Date;
  chef: ChefSuivi;
  etape: EtapeSuivie;
  objectif: { code: string; description: string };
};

export type BadgeARemettre = {
  id: string;
  valideeAt: Date | null;
  chef: { name: string; email: string; groupe: string | null };
  etape: { name: string };
  valideePar: { name: string } | null;
};

export function joursDepuis(date: Date, maintenant: Date = new Date()): number {
  return Math.max(
    0,
    Math.floor((maintenant.getTime() - date.getTime()) / UN_JOUR_MS),
  );
}

export function syntheseParEtape(
  etapes: EtapeSuivie[],
  enAttente: {
    aEvaluer: { etape: { id: string } }[];
    enAttenteDuChef: { etape: { id: string } }[];
    aValider: { etapeId: string }[];
  },
): LigneSynthese[] {
  const compter = (ids: string[]) =>
    ids.reduce(
      (compte, id) => compte.set(id, (compte.get(id) ?? 0) + 1),
      new Map<string, number>(),
    );
  const aEvaluer = compter(enAttente.aEvaluer.map(({ etape }) => etape.id));
  const enAttenteDuChef = compter(
    enAttente.enAttenteDuChef.map(({ etape }) => etape.id),
  );
  const aValider = compter(enAttente.aValider.map(({ etapeId }) => etapeId));

  return etapes
    .map((etape) => ({
      ...etape,
      aEvaluer: aEvaluer.get(etape.id) ?? 0,
      enAttenteDuChef: enAttenteDuChef.get(etape.id) ?? 0,
      aValider: aValider.get(etape.id) ?? 0,
    }))
    .filter(
      (ligne) => ligne.aEvaluer + ligne.enAttenteDuChef + ligne.aValider > 0,
    );
}

export function nomGroupe(chef: { groupe: string | null }): string {
  return chef.groupe?.trim() || SANS_GROUPE;
}

export function comparerGroupes(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (a === SANS_GROUPE || b === SANS_GROUPE) {
    return a === SANS_GROUPE ? 1 : -1;
  }

  return a.localeCompare(b, "fr");
}

export function parGroupe<T extends { chef: { groupe: string | null } }>(
  elements: T[],
): [string, T[]][] {
  const groupes = new Map<string, T[]>();

  for (const element of elements) {
    const groupe = nomGroupe(element.chef);

    groupes.set(groupe, [...(groupes.get(groupe) ?? []), element]);
  }

  return [...groupes.entries()].sort(([a], [b]) => comparerGroupes(a, b));
}

export function versCsvARemettre(badges: BadgeARemettre[]): string {
  return tableauCsv(
    ["Groupe", "Chef", "Email", "Badge", "Valide le", "Valide par"],
    parGroupe(badges).flatMap(([groupe, badgesDuGroupe]) =>
      badgesDuGroupe.map((badge) => [
        groupe,
        badge.chef.name,
        badge.chef.email,
        badge.etape.name,
        badge.valideeAt ? badge.valideeAt.toISOString().slice(0, 10) : "",
        badge.valideePar?.name ?? "",
      ]),
    ),
  );
}

export function lignesEnAttente(
  enAttente: {
    etapes: EtapeSuivie[];
    aEvaluer: JustificationEnAttente[];
    enAttenteDuChef: JustificationEnAttente[];
    aValider: { chef: ChefSuivi; etapeId: string }[];
  },
  espace: EspaceSuivi,
): LigneAttente[] {
  const etapes = new Map(enAttente.etapes.map((etape) => [etape.id, etape]));
  const ouvrable = (etape: EtapeSuivie) =>
    espace === "referent" || estNiveauEtape3(etape.niveau);
  const justification =
    (type: TypeAttente, depuis: (j: JustificationEnAttente) => Date | null) =>
    (j: JustificationEnAttente): LigneAttente => ({
      id: `${type}-${j.id}`,
      type,
      chef: j.chef,
      etape: j.etape,
      objet: `${j.objectif.code} - ${j.objectif.description}`,
      depuis: depuis(j),
      lien: ouvrable(j.etape) ? lienDiscussion(espace, j.etape.id, j.id) : null,
    });

  return [
    ...enAttente.aEvaluer.map(justification("a-evaluer", (j) => j.soumiseAt)),
    ...enAttente.enAttenteDuChef.map(
      justification("attente-chef", (j) => j.updatedAt),
    ),
    ...enAttente.aValider.flatMap(({ chef, etapeId }) => {
      const etape = etapes.get(etapeId);

      return etape
        ? [
            {
              id: `a-valider-${etapeId}-${chef.id}`,
              type: "a-valider" as const,
              chef,
              etape,
              objet: "Dossier complet",
              depuis: null,
              lien: ouvrable(etape)
                ? lienDossier(espace, chef.id, etapeId)
                : null,
            },
          ]
        : [];
    }),
  ];
}
