import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer la justification avec tous les commentaires et leurs auteurs
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
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur a accès à cette justification
    // (soit c'est le chef, soit c'est un référent assigné à cette étape)
    if (justification.chefId !== user.id && (!("role" in user) || user.role !== "REFERENT")) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    // Si c'est un référent, vérifier qu'il est assigné à cette étape
    if ("role" in user && user.role === "REFERENT") {
      const etapeReferent = await prisma.etapeReferent.findFirst({
        where: {
          referentId: user.id,
          etapeId: justification.etapeId,
        },
      });

      if (!etapeReferent) {
        return NextResponse.json(
          { error: "Accès refusé" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(justification);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { contenu, type } = await request.json();

    if (!contenu || !type) {
      return NextResponse.json(
        { error: "Contenu et type sont requis" },
        { status: 400 }
      );
    }

    // Récupérer la justification
    const justification = await prisma.justification.findUnique({
      where: { id },
    });

    if (!justification) {
      return NextResponse.json(
        { error: "Justification non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est soit le chef, soit un référent assigné
    if (justification.chefId !== user.id && (!("role" in user) || user.role !== "REFERENT")) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    if ("role" in user && user.role === "REFERENT") {
      const etapeReferent = await prisma.etapeReferent.findFirst({
        where: {
          referentId: user.id,
          etapeId: justification.etapeId,
        },
      });

      if (!etapeReferent) {
        return NextResponse.json(
          { error: "Accès refusé" },
          { status: 403 }
        );
      }
    }

    // Créer le commentaire
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
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
