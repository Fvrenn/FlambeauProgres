import { Commentaire, User, Justification } from "@prisma/client";

export type CommentaireAvecAuteur = Commentaire & {
  auteur: User;
  isPending?: boolean; // Pour l'UI optimiste
};

export type JustificationWithComments = Justification & {
  commentaires: CommentaireAvecAuteur[];
  chef: User;
  objectif: {
    code: string;
    description: string;
  };
};
