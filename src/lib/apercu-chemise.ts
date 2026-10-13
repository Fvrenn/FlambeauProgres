import type { Branche } from "@/lib/wordpress-profile";

export const REQUETE_TELEPHONE = "(max-width: 767px)";

type FormatApercu = "ordinateur" | "telephone";

export type BarettesApercu = {
  etape1Validee: boolean;
  etape2Validee: boolean;
};

export function cheminApercuChemise(
  format: FormatApercu,
  branche: Branche | null,
  { etape1Validee, etape2Validee }: BarettesApercu = {
    etape1Validee: false,
    etape2Validee: false,
  },
): string {
  const barettes = etape2Validee ? "-etape2" : etape1Validee ? "-etape1" : "";

  return `/chemise/apercu-${format}-${branche?.toLowerCase() ?? "sans-branche"}${barettes}.webp`;
}
