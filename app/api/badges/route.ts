import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/types/auth";
import { badgeSchema } from "@/schemas/badgeSchema";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Types pour la réponse
type BadgeResponse = {
  id: string; // Changé en string pour correspondre au schema Prisma (cuid)
  number: string;
  name: string;
  description: string;
  image_src: string | null;
  couleur: string | null;
  ordre: number;
  actif: boolean;
  createdAt: string;
};

// Handler pour POST
export async function POST(req: NextRequest) {
  try {
    // Utiliser l'API serveur Better Auth et passer les headers de la requête
    const session = await import("@/lib/auth").then(({ auth }) =>
      auth.api.getSession({ headers: req.headers })
    );

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = session.user as SessionUser;

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé - rôle ADMIN requis" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = badgeSchema.parse(body);

    const newBadge = await prisma.badge.create({
      data: {
        ...validatedData,
        image_src: validatedData.image_src || null,
        couleur: validatedData.couleur || null,
        actif: validatedData.actif ?? true,
      },
    });

    const response: BadgeResponse = {
      id: newBadge.id,
      number: newBadge.number,
      name: newBadge.name,
      description: newBadge.description,
      image_src: newBadge.image_src,
      couleur: newBadge.couleur,
      ordre: newBadge.ordre,
      actif: newBadge.actif,
      createdAt: newBadge.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création du badge:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
