// app/api/badges/route.ts
import { NextRequest, NextResponse } from "next/server";
import { badgeSchema } from "@/schemas/badgeSchema";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TypeObjectif } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // ÉTAPE 1: Valider les données
    const body = await req.json();
    const validatedData = badgeSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
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

      // 2b. Créer les compétences (si il y en a)
      let competencesCount = 0;
      if (validatedData.competences.length > 0) {
        // Extraire la lettre du badge (ex: "2F" -> "F")
        const badgeLetter = newBadge.number.replace(/^\d+/, '');
        
        const competencesData = validatedData.competences.map((comp, index) => ({
          badgeId: newBadge.id,
          code: `${badgeLetter}${index + 1}`,
          titre: `Compétence ${index + 1}`,
          description: comp.description,
          type: TypeObjectif.COMPETENCE,
          ordre: index + 1,
          fichiersRequis: false,
        }));

        await tx.objectif.createMany({
          data: competencesData,
        });

        competencesCount = competencesData.length;
      }

      return { badge: newBadge, competencesCount };
    });

    // ÉTAPE 3: Renvoyer la réponse
    return NextResponse.json(
      {
        id: result.badge.id,
        number: result.badge.number,
        name: result.badge.name,
        description: result.badge.description,
        image_src: result.badge.image_src,
        ordre: result.badge.ordre,
        actif: result.badge.actif,
        createdAt: result.badge.createdAt.toISOString(),
        updatedAt: result.badge.updatedAt.toISOString(),
        competencesCount: result.competencesCount,
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