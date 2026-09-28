import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    objectif: { groupBy: vi.fn() },
    justification: { findMany: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn() },
    etape: { findUnique: vi.fn() },
    etapeReferent: { findFirst: vi.fn() },
    user: { findMany: vi.fn(), findUnique: vi.fn() },
  },
}));

vi.mock("@/services/etape.service", () => ({
  EtapeService: { estDossierComplet: vi.fn() },
}));

import { prisma } from "@/lib/prisma";
import { EtapeService } from "@/services/etape.service";
import { USER_RESUME_SELECT } from "@/services/user.service";
import { ReferentService } from "@/services/referent.service";

const db = vi.mocked(prisma, true);
const etapeService = vi.mocked(EtapeService, true);
const referent = { id: "ref1", role: "REFERENT" as const };

beforeEach(() => {
  vi.resetAllMocks();
  db.objectif.groupBy.mockResolvedValue([
    { type: "COMPETENCE", _count: { id: 1 } },
    { type: "REALISATION", _count: { id: 1 } },
  ] as never);
  db.justification.findMany.mockImplementation((async (args: {
    select?: unknown;
  }) =>
    args.select
      ? [
          { chefId: "complet", objectif: { type: "COMPETENCE" } },
          { chefId: "complet", objectif: { type: "REALISATION" } },
          { chefId: "dejaValide", objectif: { type: "COMPETENCE" } },
          { chefId: "dejaValide", objectif: { type: "REALISATION" } },
          { chefId: "incomplet", objectif: { type: "COMPETENCE" } },
        ]
      : []) as never);
  db.chefEtapeStatut.findMany.mockResolvedValue([
    { chefId: "dejaValide" },
  ] as never);
  db.etape.findUnique.mockResolvedValue({ niveau: 2 } as never);
  db.etapeReferent.findFirst.mockResolvedValue({ id: "a1" } as never);
  db.user.findMany.mockResolvedValue([] as never);
});

describe("ReferentService.getDashboard", () => {
  it("ne propose à la révision que les chefs complets pas encore validés", async () => {
    await ReferentService.getDashboard("e1", referent);

    expect(db.user.findMany).toHaveBeenCalledTimes(1);
    expect(db.user.findMany).toHaveBeenCalledWith({
      where: { id: { in: ["complet"] } },
      select: USER_RESUME_SELECT,
    });
  });

  it("ne cherche aucun chef quand personne n'est à réviser", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { chefId: "complet" },
      { chefId: "dejaValide" },
    ] as never);

    const dashboard = await ReferentService.getDashboard("e1", referent);

    expect(dashboard.chefsAReviser).toEqual([]);
    expect(db.user.findMany).not.toHaveBeenCalled();
  });

  it("autorise l'évaluation au référent assigné", async () => {
    const dashboard = await ReferentService.getDashboard("e1", referent);

    expect(dashboard.peutEvaluer).toBe(true);
  });
});

describe("ReferentService.getRevision", () => {
  it("renvoie null quand le chef n'existe pas", async () => {
    db.user.findUnique.mockResolvedValue(null as never);

    expect(await ReferentService.getRevision("c1", "e1", referent)).toBeNull();
  });

  it("ne charge que le résumé du chef", async () => {
    db.user.findUnique.mockResolvedValue({ id: "c1" } as never);
    etapeService.estDossierComplet.mockResolvedValue(true);

    const revision = await ReferentService.getRevision("c1", "e1", referent);

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { id: "c1" },
      select: USER_RESUME_SELECT,
    });
    expect(revision?.peutValider).toBe(true);
  });

  it("bloque la validation tant que le dossier est incomplet", async () => {
    db.user.findUnique.mockResolvedValue({ id: "c1" } as never);
    etapeService.estDossierComplet.mockResolvedValue(false);

    const revision = await ReferentService.getRevision("c1", "e1", referent);

    expect(revision?.peutValider).toBe(false);
    expect(revision?.refusValidation).toContain("doivent être validées");
  });

  it("ne liste pour l'étape 3 que les compétences évaluées par la commission", async () => {
    db.etape.findUnique.mockResolvedValue({ id: "e3", niveau: 3 } as never);
    db.user.findUnique.mockResolvedValue({ id: "c1" } as never);

    await ReferentService.getRevision("c1", "e3", referent);

    expect(db.justification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ statut: "VALIDEE" }),
      }),
    );
  });
});
