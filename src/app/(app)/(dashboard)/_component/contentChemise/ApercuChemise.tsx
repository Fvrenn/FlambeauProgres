import type { Branche } from "@/lib/wordpress-profile";

import {
  type BarettesApercu,
  cheminApercuChemise,
  REQUETE_TELEPHONE,
} from "@/lib/apercu-chemise";

type ApercuChemiseProps = {
  branche: Branche | null;
  barettes: BarettesApercu;
  className?: string;
};

export default function ApercuChemise({
  branche,
  barettes,
  className = "",
}: ApercuChemiseProps) {
  return (
    <picture
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <source
        media={REQUETE_TELEPHONE}
        srcSet={cheminApercuChemise("telephone", branche, barettes)}
      />
      <img
        alt=""
        className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2"
        fetchPriority="high"
        src={cheminApercuChemise("ordinateur", branche, barettes)}
      />
    </picture>
  );
}
