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

// GET - Récupérer la liste des utilisateurs
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Seuls les ADMIN et REFERENT peuvent voir la liste des utilisateurs
    if (currentUser.role !== "ADMIN" && currentUser.role !== "REFERENT") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
