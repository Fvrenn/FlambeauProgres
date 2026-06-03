import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-server", () => ({
  getUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => {
  const prisma = {
    justification: { findUnique: vi.fn() },
    etapeReferent: { findFirst: vi.fn() },
  };

  return { default: prisma, prisma };
});

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { authorizeRole, canAccessJustification } from "@/lib/auth-guards";

const mockedGetUser = vi.mocked(getUser);
const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("authorizeRole", () => {
  it("returns null when not authenticated", async () => {
    mockedGetUser.mockResolvedValue(undefined as never);

    expect(await authorizeRole("ADMIN")).toBeNull();
  });

  it("returns null when the user has no role", async () => {
    mockedGetUser.mockResolvedValue({
      id: "u1",
      email: "a@b.c",
      name: "A",
    } as never);

    expect(await authorizeRole("ADMIN")).toBeNull();
  });

  it("returns null when the role is not in the allowed list", async () => {
    mockedGetUser.mockResolvedValue({ id: "u1", role: "CHEF" } as never);

    expect(await authorizeRole("ADMIN")).toBeNull();
  });

  it("returns the user when the role matches", async () => {
    const user = { id: "u1", role: "ADMIN" };

    mockedGetUser.mockResolvedValue(user as never);

    expect(await authorizeRole("ADMIN")).toBe(user);
  });

  it("accepts any of several allowed roles", async () => {
    mockedGetUser.mockResolvedValue({ id: "u1", role: "REFERENT" } as never);

    expect(await authorizeRole("ADMIN", "REFERENT")).not.toBeNull();
  });
});

describe("canAccessJustification", () => {
  it("returns false when the justification does not exist", async () => {
    db.justification.findUnique.mockResolvedValue(null as never);

    expect(await canAccessJustification("u1", "CHEF", "j1")).toBe(false);
  });

  it("returns true for the owning chef", async () => {
    db.justification.findUnique.mockResolvedValue({
      chefId: "u1",
      etapeId: "e1",
    } as never);

    expect(await canAccessJustification("u1", "CHEF", "j1")).toBe(true);
  });

  it("returns true for a referent assigned to the etape", async () => {
    db.justification.findUnique.mockResolvedValue({
      chefId: "other",
      etapeId: "e1",
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue({ id: "a1" } as never);

    expect(await canAccessJustification("ref1", "REFERENT", "j1")).toBe(true);
  });

  it("returns false for a referent NOT assigned to the etape", async () => {
    db.justification.findUnique.mockResolvedValue({
      chefId: "other",
      etapeId: "e1",
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue(null as never);

    expect(await canAccessJustification("ref1", "REFERENT", "j1")).toBe(false);
  });

  it("returns false for a chef who is not the owner", async () => {
    db.justification.findUnique.mockResolvedValue({
      chefId: "other",
      etapeId: "e1",
    } as never);

    expect(await canAccessJustification("u1", "CHEF", "j1")).toBe(false);
  });
});
