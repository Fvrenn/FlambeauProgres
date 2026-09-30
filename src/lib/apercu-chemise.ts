import type { Branche } from "@/lib/wordpress-profile";

export const REQUETE_TELEPHONE = "(max-width: 767px)";

type FormatApercu = "ordinateur" | "telephone";

export function cheminApercuChemise(
  format: FormatApercu,
  branche: Branche | null,
): string {
  return `/chemise/apercu-${format}-${branche?.toLowerCase() ?? "sans-branche"}.webp`;
}
