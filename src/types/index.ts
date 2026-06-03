import { SVGProps } from "react";
import {
  Commentaire,
  User,
  Justification,
  Prisma,
  UserRole,
} from "@prisma/client";

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

// --- Session (better-auth + customSession) ---
// role/troupeId/etapesReferent sont optionnels car la session brute peut être
// passée sans narrowing (cf. (dashboard)/layout.tsx).

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: UserRole;
  troupeId?: string | null;
  etapesReferent?: { id: string; name: string; image_src: string | null }[];
};

// --- Payloads admin : forme exacte renvoyée par les requêtes Prisma des pages ---

export type AdminUserWithTroupe = Prisma.UserGetPayload<{
  include: { troupe: true };
}>;

export type AdminTroupeListItem = Prisma.TroupeGetPayload<{
  include: {
    membres: { select: { id: true; name: true; image: true; email: true } };
    _count: { select: { membres: true } };
  };
}>;

export type AdminTroupeMember = AdminTroupeListItem["membres"][number];

export type AdminUserOption = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true };
}>;

export type AdminEtapeListItem = Prisma.EtapeGetPayload<{
  include: { _count: { select: { objectifs: true } } };
}>;

export type AdminEtapeWithObjectifs = Prisma.EtapeGetPayload<{
  include: { objectifs: true };
}>;

export type AdminEtapeWithReferents = Prisma.EtapeGetPayload<{
  include: { referents: { include: { referent: true } } };
}>;
