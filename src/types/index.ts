import type { WpProfile } from "@/lib/wordpress-profile";

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
  etapesReferent?: { id: string; name: string; image_src: string | null }[];
  wp?: WpProfile | null;
};

export type AdminEtapeListItem = Prisma.EtapeGetPayload<{
  include: { _count: { select: { objectifs: true } } };
}>;

export type AdminEtapeWithObjectifs = Prisma.EtapeGetPayload<{
  include: { objectifs: true };
}>;

export type AdminEtapeWithReferents = Prisma.EtapeGetPayload<{
  include: { referents: { include: { referent: true } } };
}>;
