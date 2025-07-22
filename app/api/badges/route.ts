import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { SessionUser } from "@/types/auth";
import { badgeSchema } from "@/schemas/badgeSchema";
import { prisma } from "@/lib/prisma";
import { TypeObjectif } from "@prisma/client";

// Types pour la réponse
type BadgeResponse = {
  id: string;
  number: string;
  name: string;
  description: string;
  image_src: string | null;
  couleur: string | null;
  ordre: number;
  actif: boolean;
  createdAt: string;
  competencesCount: number;
  realisationsCount: number;
};

// Handler pour POST
export async function POST(req: NextRequest) {
  try {
    // Authentification
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

    // Validation des données
    const body = await req.json();
    const validatedData = badgeSchema.parse(body);

    // Création du badge avec ses relations dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Créer le badge
      const newBadge = await tx.badge.create({
        data: {
          number: validatedData.number,
          name: validatedData.name,
          description: validatedData.description,
          image_src: validatedData.image_src || null,
          couleur: validatedData.couleur || null,
          ordre: validatedData.ordre,
          actif: validatedData.actif,
        },
      });

      let competencesCount = 0;
      let realisationsCount = 0;

      // Extraire la lettre du badge (ex: "2L" -> "L")
      const badgeLetter = newBadge.number.replace(/^\d+/, ''); // Enlève les chiffres du début
      let currentCodeNumber = 1;

      // 2. Créer les compétences
      if (validatedData.competences && validatedData.competences.length > 0) {
        const competencesData = validatedData.competences.map((comp, index) => ({
          badgeId: newBadge.id,
          code: `${badgeLetter}${currentCodeNumber + index}`, // L1, L2, etc.
          titre: `Compétence ${currentCodeNumber + index}`, // Titre court
          description: comp.description,
          type: TypeObjectif.COMPETENCE,
          ordre: index + 1,
          fichiersRequis: false,
        }));

        await tx.objectif.createMany({
          data: competencesData,
        });

        competencesCount = competencesData.length;
        currentCodeNumber += competencesCount; 
      }

      // 3. Créer les réalisations (blocs et leurs options)
      if (validatedData.realisations && validatedData.realisations.length > 0) {
        for (let blockIndex = 0; blockIndex < validatedData.realisations.length; blockIndex++) {
          const realisationBlock = validatedData.realisations[blockIndex];
          
          // Créer le bloc parent
          const parentBlock = await tx.objectif.create({
            data: {
              badgeId: newBadge.id,
              code: `${badgeLetter}${currentCodeNumber}_BLOCK`, // L8_BLOCK par exemple
              titre: `Bloc de réalisations ${blockIndex + 1}`,
              description: realisationBlock.description,
              type: TypeObjectif.REALISATION,
              ordre: competencesCount + blockIndex + 1, // Après les compétences
              fichiersRequis: true,
              blockTitle: realisationBlock.description,
              requiredCount: realisationBlock.requiredCount || 1,
            },
          });

          // Créer les options du bloc
          const optionsData = realisationBlock.options.map((option, optionIndex) => ({
            badgeId: newBadge.id,
            code: `${badgeLetter}${currentCodeNumber + optionIndex}`, // L8, L9, etc.
            titre: `Réalisation ${currentCodeNumber + optionIndex}`,
            description: option.description,
            type: TypeObjectif.REALISATION,
            ordre: optionIndex + 1,
            fichiersRequis: true,
            parentId: parentBlock.id,
          }));

          await tx.objectif.createMany({
            data: optionsData,
          });

          realisationsCount += optionsData.length;
          currentCodeNumber += optionsData.length; // Incrementer pour le prochain bloc
        }
      }

      return {
        badge: newBadge,
        competencesCount,
        realisationsCount,
      };
    });

    // Formatage de la réponse
    const response: BadgeResponse = {
      id: result.badge.id,
      number: result.badge.number,
      name: result.badge.name,
      description: result.badge.description,
      image_src: result.badge.image_src,
      couleur: result.badge.couleur,
      ordre: result.badge.ordre,
      actif: result.badge.actif,
      createdAt: result.badge.createdAt.toISOString(),
      competencesCount: result.competencesCount,
      realisationsCount: result.realisationsCount,
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

    // Erreur de contrainte unique (numéro de badge déjà existant)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: "Ce numéro de badge existe déjà",
          details: "Veuillez choisir un numéro différent"
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}