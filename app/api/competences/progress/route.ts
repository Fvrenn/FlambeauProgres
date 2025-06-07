import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Fonction pour extraire l'utilisateur du JWT
function getUserFromToken(request: Request): JWTPayload | null {
  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

// GET - Récupérer les progressions d'un utilisateur
export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const progressions = await prisma.userCompetenceProgress.findMany({
      where: { userId: user.userId },
      select: {
        competenceId: true,
        isCompleted: true,
        completedAt: true,
      },
    });

    // Convertir en Map pour une récupération plus facile côté client
const progressMap = progressions.reduce((acc: Record<number, { isCompleted: boolean; completedAt: Date | null }>, prog: { competenceId: number; isCompleted: boolean; completedAt: Date | null }) => {
  acc[prog.competenceId] = {
    isCompleted: prog.isCompleted,
    completedAt: prog.completedAt,
  };
  return acc;
}, {} as Record<number, { isCompleted: boolean; completedAt: Date | null }>);

    return NextResponse.json(progressMap);
  } catch (error) {
    console.error("Erreur lors de la récupération des progressions:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder ou mettre à jour une progression
export async function POST(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { competenceId, isCompleted } = await request.json();

    if (typeof competenceId !== "number" || typeof isCompleted !== "boolean") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    // Vérifier que la compétence existe
    const competence = await prisma.competences.findUnique({
      where: { id: competenceId },
    });

    if (!competence) {
      return NextResponse.json(
        { error: "Compétence non trouvée" },
        { status: 404 }
      );
    }

    // Upsert la progression
    const progression = await prisma.userCompetenceProgress.upsert({
      where: {
        userId_competenceId: {
          userId: user.userId,
          competenceId: competenceId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.userId,
        competenceId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json(progression);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
