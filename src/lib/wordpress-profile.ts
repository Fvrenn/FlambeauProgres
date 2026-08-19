export type Branche = "F" | "PF";

export type WpTaxonomyEntry = { value: string; label: string };

export type WpProfile = {
  group: string | null;
  branche: Branche | null;
  fonctions: string[];
  progression: string[];
};

const BRANCHE_BY_FONCTION_VALUE: Record<string, Branche> = {
  "102": "PF",
  "103": "F",
};

export function normalizeWpLabel(label: string): string {
  return label
    .replace(/<[^>]*>/g, "")
    .replace(/^[\s-]+/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function detectBranche(
  fonctions: WpTaxonomyEntry[] | undefined,
): Branche | null {
  if (!fonctions?.length) {
    return null;
  }

  for (const entry of fonctions) {
    const known = BRANCHE_BY_FONCTION_VALUE[entry.value];

    if (known) {
      return known;
    }
  }

  for (const entry of fonctions) {
    const label = normalizeWpLabel(entry.label);

    if (/\bpf\b/.test(label) || label.includes("petits flambeaux")) {
      return "PF";
    }

    if (/\bflbx\b/.test(label) || label.includes("flambeaux")) {
      return "F";
    }
  }

  return null;
}

export function parseWpProfile(wp: {
  group?: string | null;
  fonction?: WpTaxonomyEntry[];
  progression?: WpTaxonomyEntry[];
}): WpProfile {
  return {
    group: wp.group?.trim() || null,
    branche: detectBranche(wp.fonction),
    fonctions: (wp.fonction ?? []).map((entry) =>
      normalizeWpLabel(entry.label),
    ),
    progression: (wp.progression ?? []).map((entry) =>
      normalizeWpLabel(entry.label),
    ),
  };
}

export function getWpProfile(user: unknown): WpProfile | null {
  if (user && typeof user === "object" && "wp" in user) {
    return (user as { wp?: WpProfile | null }).wp ?? null;
  }

  return null;
}
