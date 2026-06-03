import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const justification = await prisma.justification.findUnique({
      where: { id },
      include: {
        commentaires: {
          include: {
            auteur: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        chef: true,
        objectif: {
          select: {
            code: true,
            description: true,
          },
        },
      },
    });

    if (!justification) {
      return NextResponse.json(
        { error: "Justification non trouvée" },
        { status: 404 },
      );
    }

    if (
      justification.chefId !== user.id &&
      (!("role" in user) || user.role !== "REFERENT")
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    if ("role" in user && user.role === "REFERENT") {
      const etapeReferent = await prisma.etapeReferent.findFirst({
        where: {
          referentId: user.id,
          etapeId: justification.etapeId,
        },
      });

      if (!etapeReferent) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
    }

    return NextResponse.json(justification);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { contenu, type } = await request.json();

    if (!contenu || !type) {
      return NextResponse.json(
        { error: "Contenu et type sont requis" },
        { status: 400 },
      );
    }

    const justification = await prisma.justification.findUnique({
      where: { id },
    });

    if (!justification) {
      return NextResponse.json(
        { error: "Justification non trouvée" },
        { status: 404 },
      );
    }

    if (
      justification.chefId !== user.id &&
      (!("role" in user) || user.role !== "REFERENT")
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    if ("role" in user && user.role === "REFERENT") {
      const etapeReferent = await prisma.etapeReferent.findFirst({
        where: {
          referentId: user.id,
          etapeId: justification.etapeId,
        },
      });

      if (!etapeReferent) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
    }

    const newComment = await prisma.commentaire.create({
      data: {
        justificationId: id,
        auteurId: user.id,
        contenu,
        type,
      },
      include: {
        auteur: true,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
