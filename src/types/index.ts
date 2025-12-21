import { SVGProps } from "react";
import { Commentaire, User, Justification } from "@prisma/client";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CommentaireAvecAuteur = Commentaire & {
  auteur: User;
  isPending?: boolean;
};

export type JustificationAvecCommentaires = Justification & {
  commentaires?: CommentaireAvecAuteur[];
};

export type JustificationWithComments = Justification & {
  commentaires: CommentaireAvecAuteur[];
  chef: User;
  objectif: {
    code: string;
    description: string;
  };
};