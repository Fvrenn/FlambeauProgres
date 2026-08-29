import type { WpTaxonomyEntry } from "./wordpress-profile";

import { normalizeWpLabel } from "./wordpress-profile";

export type EtapeCorrespondance = {
  id: string;
  name: string;
  wpValue: string | null;
};

export type ResolutionProgression = {
  etapeIds: string[];
  nonReconnues: WpTaxonomyEntry[];
};

export function resoudreProgressionWp(
  entries: WpTaxonomyEntry[],
  etapes: EtapeCorrespondance[],
): ResolutionProgression {
  const parValeur = new Map<string, string>();
  const parLibelle = new Map<string, string>();

  for (const etape of etapes) {
    if (etape.wpValue) {
      parValeur.set(etape.wpValue, etape.id);
    }

    parLibelle.set(normalizeWpLabel(etape.name), etape.id);
  }

  const etapeIds: string[] = [];
  const dejaVues = new Set<string>();
  const nonReconnues: WpTaxonomyEntry[] = [];

  for (const entry of entries) {
    const etapeId =
      parLibelle.get(normalizeWpLabel(entry.label)) ??
      parValeur.get(entry.value);

    if (!etapeId) {
      nonReconnues.push(entry);
      continue;
    }

    if (!dejaVues.has(etapeId)) {
      dejaVues.add(etapeId);
      etapeIds.push(etapeId);
    }
  }

  return { etapeIds, nonReconnues };
}

export function valeursWpPourEtapes(
  etapeIds: string[],
  etapes: EtapeCorrespondance[],
): { valeurs: string[]; sansCorrespondance: string[] } {
  const parId = new Map(etapes.map((etape) => [etape.id, etape]));
  const valeurs: string[] = [];
  const sansCorrespondance: string[] = [];

  for (const etapeId of etapeIds) {
    const wpValue = parId.get(etapeId)?.wpValue;

    if (wpValue) {
      valeurs.push(wpValue);
    } else {
      sansCorrespondance.push(etapeId);
    }
  }

  return { valeurs, sansCorrespondance };
}
