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

// GET - Récupérer les progressions d'un utilisateur spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const targetUserId = parseInt(params.id);
    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      );
    }

    // Seuls les ADMIN et REFERENT peuvent voir les progressions d'autres utilisateurs
    // Un utilisateur peut voir ses propres progressions
    if (currentUser.role !== "ADMIN" && currentUser.role !== "REFERENT" && currentUser.userId !== targetUserId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const progressions = await prisma.userCompetenceProgress.findMany({
      where: { userId: targetUserId },
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
