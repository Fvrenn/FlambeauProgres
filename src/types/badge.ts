import type { Referent } from "./referent";

export type Badge = {
  id: string;
  number: string;
  name: string;
  description: string;
  image_src: string;
  ordre: number;
  objectifs: Array<{
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis?: boolean;
  }>;
  assignedReferents?: Referent[];
};