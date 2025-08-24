import type { Justification } from "./justification";

export type JustificationWithRelations = Justification & {
  chef: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  badge: {
    id: string;
    name: string;
  };
  objectif: {
    id: string;
    code: string;
    description: string;
  };
};