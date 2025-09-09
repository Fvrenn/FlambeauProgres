import type { Referent } from "./referent";
import type { StatutJustification } from "@prisma/client";

export type Badge = {
  id: string;
  number: string;
  name: string;
  description: string;
  image_src: string;
  ordre: number;
  objectifs: Array<{
    id: string;
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis: boolean;
    justifications?: {
      id: string;
      statut: StatutJustification;
      soumiseAt: string | null;
      valideeAt: string | null;
    }[];
  }>;
  assignedReferents?: Referent[];
};
