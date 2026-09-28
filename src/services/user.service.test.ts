import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findMany: vi.fn(), update: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { ROLES_REFERENT } from "@/lib/roles";
import { USER_RESUME_SELECT, UserService } from "@/services/user.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("UserService", () => {
  it("n'envoie à l'admin que les champs affichés", async () => {
    await UserService.listForAdmin();

    expect(db.user.findMany).toHaveBeenCalledWith({
      select: { id: true, name: true, email: true, image: true, role: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("liste les référents triés par nom", async () => {
    await UserService.listReferents();

    expect(db.user.findMany).toHaveBeenCalledWith({
      where: { role: { in: ROLES_REFERENT } },
      select: USER_RESUME_SELECT,
      orderBy: { name: "asc" },
    });
  });

  it("change le rôle d'un utilisateur", async () => {
    await UserService.updateRole("u1", "REFERENT");

    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { role: "REFERENT" },
      select: { id: true },
    });
  });
});
