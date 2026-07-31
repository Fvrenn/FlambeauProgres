import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    justification: { findUnique: vi.fn(), update: vi.fn() },
    etapeReferent: { findFirst: vi.fn(), findMany: vi.fn() },
    notification: { create: vi.fn(), createMany: vi.fn() },
    message: { create: vi.fn() },
    $transaction: vi.fn(),
  };

  return { default: prisma, prisma };
});

vi.mock("@/lib/auth-guards", () => ({
  canAccessJustification: vi.fn(),
}));

import prisma from "@/lib/prisma";
import { canAccessJustification } from "@/lib/auth-guards";
import { DiscussionService } from "@/services/discussion.service";

const db = vi.mocked(prisma, true);
const canAccess = vi.mocked(canAccessJustification);

const fichierData = {
  nomOriginal: "photo.jpg",
  nomStockage: "stored-photo.jpg",
  cheminFichier: "justifications/stored-photo.jpg",
  type: "IMAGE" as const,
  mimeType: "image/jpeg",
  taille: 1234,
};

beforeEach(() => {
  vi.resetAllMocks();
  db.$transaction.mockImplementation(async (cb: (tx: typeof db) => unknown) =>
    cb(db),
  );
  db.message.create.mockResolvedValue({ id: "m1" } as never);
  db.justification.update.mockResolvedValue({} as never);
  db.notification.create.mockResolvedValue({} as never);
  db.notification.createMany.mockResolvedValue({ count: 1 } as never);
});

describe("DiscussionService.addMessage", () => {
  it("nests the Fichier create inside the Message when a file is attached", async () => {
    await DiscussionService.addMessage(db as never, {
      justificationId: "j1",
      auteurId: "c1",
      contenu: "voici la photo",
      type: "USER",
      fichierData,
    });

    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          justificationId: "j1",
          auteurId: "c1",
          type: "USER",
          fichier: {
            create: expect.objectContaining({
              justificationId: "j1",
              nomOriginal: "photo.jpg",
              nomStockage: "stored-photo.jpg",
            }),
          },
        }),
        include: { auteur: true, fichier: true },
      }),
    );
  });

  it("leaves fichier undefined when no file is attached", async () => {
    await DiscussionService.addMessage(db as never, {
      justificationId: "j1",
      auteurId: "c1",
      contenu: "juste du texte",
      type: "USER",
    });

    const data = db.message.create.mock.calls[0][0].data;

    expect(data.fichier).toBeUndefined();
  });
});

describe("DiscussionService.getThread", () => {
  it("refuses access when canAccessJustification returns false", async () => {
    canAccess.mockResolvedValue(false);

    const result = await DiscussionService.getThread("u1", "CHEF", "j1");

    expect(result.success).toBe(false);
    expect(db.justification.findUnique).not.toHaveBeenCalled();
  });

  it("fails when the justification does not exist", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue(null as never);

    const result = await DiscussionService.getThread("u1", "CHEF", "j1");

    expect(result.success).toBe(false);
  });

  it("returns the ordered thread on success", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      statut: "SOUMISE",
      objectif: { code: "G8", description: "desc" },
      chef: { id: "c1", name: "Chef" },
      messages: [{ id: "m1" }, { id: "m2" }],
    } as never);

    const result = await DiscussionService.getThread("c1", "CHEF", "j1");

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.justificationId).toBe("j1");
    expect(result.data.statut).toBe("SOUMISE");
    expect(result.data.objectif.code).toBe("G8");
    expect(result.data.chef.name).toBe("Chef");
    expect(result.data.messages).toHaveLength(2);
  });
});

describe("DiscussionService.postMessage", () => {
  it("rejects an empty message before any authz check", async () => {
    const result = await DiscussionService.postMessage({
      viewerId: "c1",
      viewerRole: "CHEF",
      authorName: "Chef",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(canAccess).not.toHaveBeenCalled();
  });

  it("refuses access when canAccessJustification returns false", async () => {
    canAccess.mockResolvedValue(false);

    const result = await DiscussionService.postMessage({
      viewerId: "u1",
      viewerRole: "CHEF",
      authorName: "Chef",
      justificationId: "j1",
      contenu: "coucou",
    });

    expect(result.success).toBe(false);
    expect(db.justification.findUnique).not.toHaveBeenCalled();
  });

  it("blocks posting once the thread is VALIDEE (read-only)", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "VALIDEE",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);

    const result = await DiscussionService.postMessage({
      viewerId: "c1",
      viewerRole: "CHEF",
      authorName: "Chef",
      justificationId: "j1",
      contenu: "encore un mot",
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("chef post → statut SOUMISE + notifies the etape referents", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "DEMANDE_PRECISION",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1", email: "ref@x.fr", name: "Ref" } },
    ] as never);

    const result = await DiscussionService.postMessage({
      viewerId: "c1",
      viewerRole: "CHEF",
      authorName: "Chef",
      justificationId: "j1",
      contenu: "ma réponse",
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j1" },
        data: expect.objectContaining({ statut: "SOUMISE" }),
      }),
    );
    expect(
      db.justification.update.mock.calls[0][0].data.soumiseAt,
    ).toBeInstanceOf(Date);
    expect(db.notification.createMany).toHaveBeenCalledTimes(1);
    expect(db.notification.create).not.toHaveBeenCalled();
  });

  it("referent post → statut DEMANDE_PRECISION + notifies the chef", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "SOUMISE",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);

    const result = await DiscussionService.postMessage({
      viewerId: "ref1",
      viewerRole: "REFERENT",
      authorName: "Ref",
      justificationId: "j1",
      contenu: "peux-tu préciser ?",
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ statut: "DEMANDE_PRECISION" }),
      }),
    );
    expect(
      db.justification.update.mock.calls[0][0].data.soumiseAt,
    ).toBeUndefined();
    expect(db.notification.create).toHaveBeenCalledTimes(1);
    expect(db.notification.createMany).not.toHaveBeenCalled();
  });

  it("accepts a file-only message (no text)", async () => {
    canAccess.mockResolvedValue(true);
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "DEMANDE_PRECISION",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1", email: "ref@x.fr", name: "Ref" } },
    ] as never);

    const result = await DiscussionService.postMessage({
      viewerId: "c1",
      viewerRole: "CHEF",
      authorName: "Chef",
      justificationId: "j1",
      fichierData,
    });

    expect(result.success).toBe(true);
    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contenu: null }),
      }),
    );
  });
});

describe("DiscussionService.validateRealisation", () => {
  it("fails when the justification does not exist", async () => {
    db.justification.findUnique.mockResolvedValue(null as never);

    const result = await DiscussionService.validateRealisation({
      referentId: "ref1",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.etapeReferent.findFirst).not.toHaveBeenCalled();
  });

  it("refuses a referent who is not assigned to the etape", async () => {
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "SOUMISE",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue(null as never);

    const result = await DiscussionService.validateRealisation({
      referentId: "ref1",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("refuses to validate an already VALIDEE thread", async () => {
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "VALIDEE",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue({ id: "a1" } as never);

    const result = await DiscussionService.validateRealisation({
      referentId: "ref1",
      justificationId: "j1",
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("validates → statut VALIDEE + SYSTEM message + notifies the chef", async () => {
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      chefId: "c1",
      etapeId: "e1",
      statut: "SOUMISE",
      objectif: { code: "G8" },
      chef: { name: "Chef" },
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue({ id: "a1" } as never);

    const result = await DiscussionService.validateRealisation({
      referentId: "ref1",
      justificationId: "j1",
    });

    expect(result.success).toBe(true);
    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "SYSTEM",
          contenu: "✓ Réalisation validée",
        }),
      }),
    );
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j1" },
        data: expect.objectContaining({ statut: "VALIDEE" }),
      }),
    );
    expect(
      db.justification.update.mock.calls[0][0].data.valideeAt,
    ).toBeInstanceOf(Date);
    expect(db.notification.create).toHaveBeenCalledTimes(1);
  });
});
