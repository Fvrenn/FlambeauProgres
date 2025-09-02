import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Correction ici
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

    const { justificationId, champ, message } = await request.json();

    if (!justificationId || !champ || !message) {
      return NextResponse.json(
        { error: "Données manquantes" },
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

    // Créer le commentaire de demande de précision
    const commentaire = await prisma.commentaire.create({
      data: {
        justificationId,
        auteurId: session.user.id,
        contenu: `Précision demandée sur le champ "${champ}": ${message}`,
        type: "REFERENT_QUESTION"
      }
    });

    // Mettre à jour le statut de la justification
    await prisma.justification.update({
      where: { id: justificationId },
      data: { statut: "DEMANDE_PRECISION" }
    });

    // Créer une notification pour le chef
    await prisma.notification.create({
      data: {
        destinataireId: justification.chefId,
        justificationId,
        type: "DEMANDE_PRECISION",
        titre: `Précision demandée sur ${justification.badge.name}`,
        message: `Le référent demande une précision sur "${champ}" pour l'objectif ${justification.objectif.code}`
      }
    });

    return NextResponse.json({
      success: true,
      commentaire
    });

  } catch (error) {
    console.error("Erreur lors de la demande de précision:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}