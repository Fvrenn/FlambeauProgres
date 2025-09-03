import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import type { ValidateJustificationRequest } from "@/src/types/validationJustification";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    if (session.user.role !== "REFERENT" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé - rôle référent requis" },
        { status: 403 }
      );
    }

    const { justificationId, action, commentaire }: ValidateJustificationRequest = await request.json();

    if (!justificationId || !action) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    if (!["VALIDER", "REFUSER"].includes(action)) {
      return NextResponse.json(
        { error: "Action invalide" },
        { status: 400 }
      );
    }

    // Vérifier que la justification existe et que le référent a accès
    const justification = await prisma.justification.findFirst({
      where: {
        id: justificationId,
        badge: {
          referents: {
            some: {
              referentId: session.user.id
            }
          }
        }
      },
      include: {
        chef: true,
        badge: true,
        objectif: true
      }
    });

    if (!justification) {
      return NextResponse.json(
        { error: "Justification non trouvée ou accès refusé" },
        { status: 404 }
      );
    }

    // Déterminer le nouveau statut
    const nouveauStatut = action === "VALIDER" ? "VALIDEE" : "REFUSEE";
    const typeCommentaire = "REFERENT_FEEDBACK";
    const messageNotification = action === "VALIDER" 
      ? `Votre justification pour ${justification.badge.name} a été validée`
      : `Votre justification pour ${justification.badge.name} a été refusée`;

    // Utiliser une transaction pour s'assurer que toutes les opérations réussissent
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour la justification
      const updatedJustification = await tx.justification.update({
        where: { id: justificationId },
        data: { 
          statut: nouveauStatut,
          valideeAt: action === "VALIDER" ? new Date() : null
        }
      });

      // Si l'action est VALIDER, supprimer tous les commentaires existants
      if (action === "VALIDER") {
        await tx.commentaire.deleteMany({
          where: {
            justificationId: justificationId
          }
        });
      }

      // Créer un commentaire si fourni (après la suppression pour VALIDER)
      if (commentaire && commentaire.trim() !== "") {
        await tx.commentaire.create({
          data: {
            justificationId,
            auteurId: session.user.id,
            contenu: commentaire,
            type: typeCommentaire
          }
        });
      }

      // Créer une notification pour le chef
      await tx.notification.create({
        data: {
          destinataireId: justification.chefId,
          justificationId,
          type: action === "VALIDER" ? "JUSTIFICATION_VALIDEE" : "JUSTIFICATION_REFUSEE",
          titre: `Justification ${action === "VALIDER" ? "validée" : "refusée"}`,
          message: messageNotification
        }
      });

      return updatedJustification;
    });

    return NextResponse.json({
      success: true,
      justification: {
        id: result.id,
        statut: result.statut
      }
    });

  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}