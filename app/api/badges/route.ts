// app/api/badges/route.ts
import { NextRequest, NextResponse } from "next/server";
import { badgeSchema } from "@/schemas/badgeSchema";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TypeObjectif } from "@prisma/client";

export async function GET() {
  try {
    // Récupérer tous les badges avec leurs objectifs associés
    const badges = await prisma.badge.findMany({
      include: {
        objectifs: {
          orderBy: {
            code: "asc",
          },
        },
      },
      orderBy: {
        ordre: "asc",
      },
    });

    // Transformer les données pour correspondre au schéma attendu
    const transformedBadges = badges.map((badge) => {
      // Séparer les compétences et réalisations
      const competences = badge.objectifs
        .filter((obj) => obj.type === TypeObjectif.COMPETENCE)
        .map((obj) => ({
          code: obj.code,
          description: obj.description,
        }));
        
      const realisations = badge.objectifs
        .filter((obj) => obj.type === TypeObjectif.REALISATION)
        .map((obj) => ({
          code: obj.code,
          description: obj.description,
        }));

      return {
        number: badge.number,
        name: badge.name,
        description: badge.description,
        image_src: badge.image_src,
        ordre: badge.ordre,
        actif: badge.actif,
        competences,
        realisations,
      };
    });

    return NextResponse.json(transformedBadges, { status: 200 });
  } catch (error) {
    console.error("Erreur récupération badges:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // ÉTAPE 1: Valider les données
    const body = await req.json();
    const validatedData = badgeSchema.parse(body);

    // app/api/badges/route.ts - seulement la partie transaction
    const result = await prisma.$transaction(async (tx) => {
      // 2a. Créer le badge (inchangé)
      const newBadge = await tx.badge.create({
        data: {
          number: validatedData.number,
          name: validatedData.name,
          description: validatedData.description,
          image_src: validatedData.image_src,
          ordre: validatedData.ordre,
          actif: validatedData.actif,
        },
      });

      const badgeLetter = newBadge.number.replace(/^\d+/, "");
      let currentCodeNumber = 1;

      // 2b. Créer les compétences (inchangé)
      let competencesCount = 0;
      if (validatedData.competences.length > 0) {
        const competencesData = validatedData.competences.map(
          (comp, index) => ({
            badgeId: newBadge.id,
            code: `${badgeLetter}${currentCodeNumber + index}`,
            description: comp.description,
            type: TypeObjectif.COMPETENCE,
            fichiersRequis: false,
          })
        );

        await tx.objectif.createMany({ data: competencesData });
        competencesCount = competencesData.length;
        currentCodeNumber += competencesCount; // Incrémenter pour les réalisations
      }

      // 2c. NOUVEAU : Créer les réalisations
      let realisationsCount = 0;
      if (validatedData.realisations.length > 0) {
        const realisationsData = validatedData.realisations.map(
          (realisation, index) => ({
            badgeId: newBadge.id,
            code: `${badgeLetter}${currentCodeNumber + index}`,
            description: realisation.description,
            type: TypeObjectif.REALISATION,
            fichiersRequis: true,
          })
        );

        await tx.objectif.createMany({ data: realisationsData });

        realisationsCount += realisationsData.length;
        currentCodeNumber += realisationsData.length;
      }

      return { badge: newBadge, competencesCount, realisationsCount };
    });

    // ÉTAPE 3: Renvoyer la réponse
    // Dans la réponse, ajouter :
    return NextResponse.json(
      {
        id: result.badge.id,
        number: result.badge.number,
        name: result.badge.name,
        description: result.badge.description,
        image_src: result.badge.image_src,
        actif: result.badge.actif,
        createdAt: result.badge.createdAt.toISOString(),
        updatedAt: result.badge.updatedAt.toISOString(),
        competencesCount: result.competencesCount,
        realisationsCount: result.realisationsCount,
      },
      { status: 201 }
    );
  } catch (error) {
    // ÉTAPE 4: Gérer les erreurs
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erreur création badge:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
