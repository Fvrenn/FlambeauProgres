import { SVGProps } from "react";
import { Prisma, UserRole } from "@prisma/client";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: UserRole;
  troupeId?: string | null;
  etapesReferent?: { id: string; name: string; image_src: string | null }[];
};

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
