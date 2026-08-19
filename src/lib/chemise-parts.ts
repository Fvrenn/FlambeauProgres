import type { Branche } from "@/lib/wordpress-profile";

const EPAULETTES_PAR_BRANCHE: Record<Branche, string[]> = {
  F: ["Epaulette branche F gauche", "Epaulette branche F droite"],
  PF: ["Epaulette branche PF gauche", "Epaulette branche PF droite"],
};

const BARETTE_ETAPE_1 = "Etape 1";
const BARETTE_ETAPE_1_DOUBLON = "Etape 1.001";
const BARETTE_ETAPE_2 = "Etape 2";

export const JALON_ETAPE_1_NUMBER = "1";

export const EPAULETTE_NODES = Object.values(EPAULETTES_PAR_BRANCHE).flat();

export const BARETTE_NODES = [
  BARETTE_ETAPE_1,
  BARETTE_ETAPE_1_DOUBLON,
  BARETTE_ETAPE_2,
];

export type EtapeAvancement = {
  number: string;
  type: string;
  isValidated?: boolean;
};

export function toSceneNodeName(name: string): string {
  return name.replace(/\s/g, "_").replace(/[[\].:/]/g, "");
}

export function evaluerAvancementBarettes(etapes: EtapeAvancement[]): {
  etape1Validee: boolean;
  etape2Validee: boolean;
} {
  const etape1Validee = etapes.some(
    (etape) =>
      etape.type === "JALON" &&
      etape.number === JALON_ETAPE_1_NUMBER &&
      etape.isValidated === true,
  );

  const etape2Validee =
    etape1Validee &&
    etapes.some(
      (etape) => etape.type === "BADGE" && etape.isValidated === true,
    );

  return { etape1Validee, etape2Validee };
}

export function getEpauletteVisibility(
  branche: Branche | null,
): Map<string, boolean> {
  const visibles = new Set(
    branche ? EPAULETTES_PAR_BRANCHE[branche].map(toSceneNodeName) : [],
  );

  return new Map(
    EPAULETTE_NODES.map((name) => {
      const sceneName = toSceneNodeName(name);

      return [sceneName, visibles.has(sceneName)];
    }),
  );
}

export function getBaretteVisibility(
  etape1Validee: boolean,
  etape2Validee: boolean,
): Map<string, boolean> {
  return new Map([
    [toSceneNodeName(BARETTE_ETAPE_1), etape1Validee],
    [toSceneNodeName(BARETTE_ETAPE_1_DOUBLON), false],
    [toSceneNodeName(BARETTE_ETAPE_2), etape2Validee],
  ]);
}

export function getChemiseVisibility(
  branche: Branche | null,
  etape1Validee: boolean,
  etape2Validee: boolean,
): Map<string, boolean> {
  return new Map([
    ...getEpauletteVisibility(branche),
    ...getBaretteVisibility(etape1Validee, etape2Validee),
  ]);
}
