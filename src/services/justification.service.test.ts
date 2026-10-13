import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    justification: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    etape: { findUnique: vi.fn() },
    etapeReferent: { findFirst: vi.fn(), findMany: vi.fn() },
    user: { findMany: vi.fn() },
    message: { create: vi.fn() },
    notification: {
      create: vi.fn(),
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    objectif: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  };

  return { prisma };
});

vi.mock("@/services/etape.service", () => ({
  EtapeService: {
    estAccessiblePourChef: vi.fn(),
    estValideePourChef: vi.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
import { EtapeService } from "@/services/etape.service";
import { JustificationService } from "@/services/justification.service";

const db = vi.mocked(prisma, true);
const etapeService = vi.mocked(EtapeService, true);

beforeEach(() => {
  vi.resetAllMocks();
  db.$transaction.mockImplementation(async (cb: (tx: typeof db) => unknown) =>
    cb(db),
  );
  db.message.create.mockResolvedValue({ id: "m1" } as never);
  db.notification.createMany.mockResolvedValue({ count: 1 } as never);
  etapeService.estAccessiblePourChef.mockResolvedValue(true);
  etapeService.estValideePourChef.mockResolvedValue(false);
});

describe("JustificationService - étape verrouillée", () => {
  beforeEach(() => {
    etapeService.estAccessiblePourChef.mockResolvedValue(false);
  });

  it("refuse une compétence d'une étape verrouillée", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { niveau: 2 },
      texteRequis: false,
    } as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
    });

    expect(result).toEqual({
      success: false,
      error: "Cette étape n'est pas encore débloquée",
    });
    expect(db.justification.create).not.toHaveBeenCalled();
    expect(db.justification.update).not.toHaveBeenCalled();
  });

  it("refuse une réalisation d'une étape verrouillée", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      texteRequis: false,
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
      fichierData: null,
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});

describe("JustificationService.submitCompetence - étape 3", () => {
  const competenceEtape3 = {
    id: "o1",
    code: "L1",
    description: "Vision",
    type: "COMPETENCE",
    etapeId: "e3",
    etape: { niveau: 3 },
    texteRequis: true,
  };

  it("envoie la compétence en évaluation à la commission au lieu de l'auto-valider", async () => {
    db.objectif.findUnique.mockResolvedValue(competenceEtape3 as never);
    db.justification.findFirst.mockResolvedValue(null as never);
    db.justification.create.mockResolvedValue({ id: "j1" } as never);
    db.etape.findUnique.mockResolvedValue({
      id: "e3",
      name: "Leader",
      niveau: 3,
    } as never);
    db.etapeReferent.findMany.mockResolvedValue([] as never);
    db.user.findMany.mockResolvedValue([
      { id: "cf1", name: "Commission", email: "cf@x.fr" },
    ] as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "Mon expérience",
    });

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ statut: "SOUMISE" }),
    });
    expect(db.message.create).toHaveBeenCalled();
    expect(db.notification.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          destinataireId: "cf1",
          titre: "Nouvelle compétence à valider",
        }),
      ],
    });
  });

  it("refuse de resoumettre une compétence déjà validée par la commission", async () => {
    db.objectif.findUnique.mockResolvedValue(competenceEtape3 as never);
    db.justification.findFirst.mockResolvedValue({
      id: "j1",
      statut: "VALIDEE",
    } as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "Encore",
    });

    expect(result).toEqual({
      success: false,
      error: "Cette compétence est déjà validée",
    });
  });
});

describe("JustificationService.submitCompetence", () => {
  it("fails when the objectif is not found", async () => {
    db.objectif.findUnique.mockResolvedValue(null as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an objectif that is not a COMPETENCE", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
    } as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
    });

    expect(result.success).toBe(false);
    expect(db.justification.create).not.toHaveBeenCalled();
  });

  it("creates an AUTO_VALIDEE justification when none exists yet", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { niveau: 2 },
    } as never);
    db.justification.findFirst.mockResolvedValue(null as never);
    db.justification.create.mockResolvedValue({} as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
    });

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          chefId: "c1",
          objectifId: "o1",
          statut: "AUTO_VALIDEE",
        }),
      }),
    );
  });

  it("updates the existing justification instead of creating a new one", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { niveau: 2 },
    } as never);
    db.justification.findFirst.mockResolvedValue({ id: "j-existing" } as never);
    db.justification.update.mockResolvedValue({} as never);

    const result = await JustificationService.submitCompetence({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "j-existing" } }),
    );
    expect(db.justification.create).not.toHaveBeenCalled();
  });
});

describe("JustificationService.submitRealisation", () => {
  it("rejects an objectif that is not a REALISATION", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { niveau: 2 },
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
      fichierData: null,
    });

    expect(result).toEqual({
      success: false,
      error: "Cet objectif n'est pas une réalisation",
    });
    expect(db.justification.create).not.toHaveBeenCalled();
  });

  it("rejects an objectif that is not a REALISATION", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { name: "E", niveau: 2 },
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
      fichierData: null,
    });

    expect(result.success).toBe(false);
    expect(db.message.create).not.toHaveBeenCalled();
  });

  it("rejects a submission with neither text nor file", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "   ",
      fichierData: null,
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("creates a SOUMISE justification with a first message and notifies the referents", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);
    db.justification.findFirst.mockResolvedValue(null as never);
    db.justification.create.mockResolvedValue({ id: "j-new" } as never);
    db.etape.findUnique.mockResolvedValue({
      id: "e1",
      name: "E",
      niveau: 2,
    } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1" } },
    ] as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "ma réalisation",
      fichierData: null,
    });

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ statut: "SOUMISE" }),
      }),
    );
    expect(db.message.create).toHaveBeenCalledTimes(1);
    expect(db.notification.createMany).toHaveBeenCalledTimes(1);
  });

  it("re-submits an existing justification by updating it (no duplicate create)", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);
    db.justification.findFirst.mockResolvedValue({ id: "j-existing" } as never);
    db.justification.update.mockResolvedValue({ id: "j-existing" } as never);
    db.etape.findUnique.mockResolvedValue({
      id: "e1",
      name: "E",
      niveau: 2,
    } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1" } },
    ] as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "nouvelle version",
      fichierData: null,
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j-existing" },
        data: expect.objectContaining({ statut: "SOUMISE" }),
      }),
    );
    expect(db.justification.create).not.toHaveBeenCalled();
    expect(db.message.create).toHaveBeenCalledTimes(1);
  });
});

describe("JustificationService.annuler", () => {
  const justification = (statut: string, type = "REALISATION") => ({
    id: "j1",
    chefId: "c1",
    etapeId: "e1",
    statut,
    objectif: { type },
  });

  it("repasse une compétence auto-validée en brouillon sans message", async () => {
    db.justification.findUnique.mockResolvedValue(
      justification("AUTO_VALIDEE", "COMPETENCE") as never,
    );

    const result = await JustificationService.annuler({
      chefId: "c1",
      justificationId: "j1",
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith({
      where: { id: "j1" },
      data: { statut: "BROUILLON", soumiseAt: null, valideeAt: null },
    });
    expect(db.message.create).not.toHaveBeenCalled();
    expect(db.notification.deleteMany).not.toHaveBeenCalled();
  });

  it("retire une réalisation en attente et efface les notifications des évaluateurs", async () => {
    db.justification.findUnique.mockResolvedValue(
      justification("SOUMISE") as never,
    );

    const result = await JustificationService.annuler({
      chefId: "c1",
      justificationId: "j1",
    });

    expect(result.success).toBe(true);
    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "SYSTEM" }),
      }),
    );
    expect(db.notification.deleteMany).toHaveBeenCalledWith({
      where: { justificationId: "j1", destinataireId: { not: "c1" } },
    });
  });

  it("refuse une réalisation déjà validée par l'évaluateur", async () => {
    db.justification.findUnique.mockResolvedValue(
      justification("VALIDEE") as never,
    );

    const result = await JustificationService.annuler({
      chefId: "c1",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.justification.update).not.toHaveBeenCalled();
  });

  it("refuse quand l'étape est déjà validée", async () => {
    db.justification.findUnique.mockResolvedValue(
      justification("AUTO_VALIDEE", "COMPETENCE") as never,
    );
    etapeService.estValideePourChef.mockResolvedValue(true);

    const result = await JustificationService.annuler({
      chefId: "c1",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.justification.update).not.toHaveBeenCalled();
  });

  it("refuse la justification d'un autre chef", async () => {
    db.justification.findUnique.mockResolvedValue(
      justification("SOUMISE") as never,
    );

    const result = await JustificationService.annuler({
      chefId: "autre",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.justification.update).not.toHaveBeenCalled();
  });
});
