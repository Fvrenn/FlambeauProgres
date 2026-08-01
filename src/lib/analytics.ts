import type { UserRole } from "@prisma/client";

export type AnalyticsPeriode = "30j" | "3m" | "12m" | "tout";

export const PERIODES: { key: AnalyticsPeriode; label: string }[] = [
  { key: "30j", label: "30 jours" },
  { key: "3m", label: "3 mois" },
  { key: "12m", label: "12 mois" },
  { key: "tout", label: "Depuis le début" },
];

const JOURS_PAR_PERIODE: Record<AnalyticsPeriode, number | null> = {
  "30j": 30,
  "3m": 90,
  "12m": 365,
  tout: null,
};

export function parsePeriode(value: string | undefined): AnalyticsPeriode {
  return value === "30j" || value === "3m" || value === "12m" || value === "tout"
    ? value
    : "tout";
}

export function debutPeriode(
  periode: AnalyticsPeriode,
  maintenant: Date,
): Date | null {
  const jours = JOURS_PAR_PERIODE[periode];

  if (jours === null) {
    return null;
  }

  return new Date(maintenant.getTime() - jours * 24 * 60 * 60 * 1000);
}

export type TypeValidation = "REALISATION" | "BADGE";

export type ValidationEvent = {
  id: string;
  type: TypeValidation;
  date: Date;
  referentId: string;
  referentName: string;
  referentRole: UserRole;
  chefId: string;
  chefName: string;
  etapeId: string;
  etapeName: string;
  objet: string;
  justificationId: string | null;
};

export type StatComptee = {
  id: string;
  label: string;
  total: number;
};

function compter(
  evenements: ValidationEvent[],
  cle: (evenement: ValidationEvent) => { id: string; label: string },
): StatComptee[] {
  const compteurs = new Map<string, StatComptee>();

  for (const evenement of evenements) {
    const { id, label } = cle(evenement);
    const stat = compteurs.get(id) ?? { id, label, total: 0 };

    stat.total += 1;
    compteurs.set(id, stat);
  }

  return [...compteurs.values()].sort(
    (a, b) => b.total - a.total || a.label.localeCompare(b.label),
  );
}

export function agregerParReferent(
  evenements: ValidationEvent[],
): StatComptee[] {
  return compter(evenements, (evenement) => ({
    id: evenement.referentId,
    label: evenement.referentName,
  }));
}

export function agregerParEtape(evenements: ValidationEvent[]): StatComptee[] {
  return compter(evenements, (evenement) => ({
    id: evenement.etapeId,
    label: evenement.etapeName,
  }));
}

export type Kpis = {
  total: number;
  realisations: number;
  badges: number;
  referentsActifs: number;
  chefsConcernes: number;
  etapesConcernees: number;
};

export function calculerKpis(evenements: ValidationEvent[]): Kpis {
  return {
    total: evenements.length,
    realisations: evenements.filter(
      (evenement) => evenement.type === "REALISATION",
    ).length,
    badges: evenements.filter((evenement) => evenement.type === "BADGE").length,
    referentsActifs: new Set(evenements.map((e) => e.referentId)).size,
    chefsConcernes: new Set(evenements.map((e) => e.chefId)).size,
    etapesConcernees: new Set(evenements.map((e) => e.etapeId)).size,
  };
}
