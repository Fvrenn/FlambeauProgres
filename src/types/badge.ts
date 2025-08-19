export type Badge = {
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
};