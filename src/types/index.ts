import type { WpProfile } from "@/lib/wordpress-profile";
import type { JUSTIFICATION_SUIVIE_INCLUDE } from "@/services/referent.service";
import type { USER_RESUME_SELECT } from "@/services/user.service";

import { Prisma, UserRole } from "@prisma/client";

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

export type UserResume = Prisma.UserGetPayload<{
  select: typeof USER_RESUME_SELECT;
}>;

export type AdminEtapeWithReferents = Prisma.EtapeGetPayload<{
  include: {
    referents: { include: { referent: { select: typeof USER_RESUME_SELECT } } };
  };
}>;

export type JustificationSuivie = Prisma.JustificationGetPayload<{
  include: typeof JUSTIFICATION_SUIVIE_INCLUDE;
}>;

export type ServiceResult<T = void> =
  | ([T] extends [void] ? { success: true } : { success: true; data: T })
  | { success: false; error: string };
