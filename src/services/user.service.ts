import type { Prisma, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ROLES_REFERENT } from "@/lib/roles";

export const USER_RESUME_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
} as const satisfies Prisma.UserSelect;

export class UserService {
  static async listForAdmin() {
    return prisma.user.findMany({
      select: USER_RESUME_SELECT,
      orderBy: { createdAt: "desc" },
    });
  }

  static async listReferents() {
    return prisma.user.findMany({
      where: { role: { in: ROLES_REFERENT } },
      select: USER_RESUME_SELECT,
      orderBy: { name: "asc" },
    });
  }

  static async updateRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true },
    });
  }
}
