import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const badgeId = parseInt(params.id);
    
    if (isNaN(badgeId)) {
      return NextResponse.json(
        { error: "ID de badge invalide" }, 
        { status: 400 }
      );
    }

    const badge = await prisma.badges.findUnique({
      where: { id: badgeId },
      include: {
        competences: {
          select: {
            id: true,
            description: true,
          },
        },
        realisations: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });
    
    if (!badge) {
      return NextResponse.json(
        { error: "Badge non trouvé" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(badge);
  } catch (error) {
    console.error("Erreur lors de la récupération du badge:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const badgeId = parseInt(params.id);
    
    if (isNaN(badgeId)) {
      return NextResponse.json(
        { error: "ID de badge invalide" }, 
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validation des données requises
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: "Le nom et la description sont requis" }, 
        { status: 400 }
      );
    }

    // Vérifier que le badge existe
    const existingBadge = await prisma.badges.findUnique({
      where: { id: badgeId },
    });

    if (!existingBadge) {
      return NextResponse.json(
        { error: "Badge non trouvé" }, 
        { status: 404 }
      );
    }

    // Utiliser une transaction pour garantir la cohérence
    const badge = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Supprimer les anciennes relations
      await tx.competences.deleteMany({ 
        where: { badge_id: badgeId } 
      });
      await tx.realisations.deleteMany({ 
        where: { badge_id: badgeId } 
      });
      
      // Mettre à jour le badge avec les nouvelles données
      return await tx.badges.update({
        where: { id: badgeId },
        data: {
          name: data.name,
          number: data.number,
          description: data.description,
          image_src: data.image_src,
          competences: {
            create: data.competences?.map((comp: any) => ({
              description: comp.description,
            })) || [],
          },
          realisations: {
            create: data.realisations?.map((real: any) => ({
              description: real.description,
            })) || [],
          },
        },
        include: {
          competences: true,
          realisations: true,
        },
      });
    });

    return NextResponse.json(badge);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du badge:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const badgeId = parseInt(params.id);
    
    if (isNaN(badgeId)) {
      return NextResponse.json(
        { error: "ID de badge invalide" }, 
        { status: 400 }
      );
    }

    // Vérifier que le badge existe
    const existingBadge = await prisma.badges.findUnique({
      where: { id: badgeId },
    });

    if (!existingBadge) {
      return NextResponse.json(
        { error: "Badge non trouvé" }, 
        { status: 404 }
      );
    }

    await prisma.badges.delete({
      where: { id: badgeId },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression du badge:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}