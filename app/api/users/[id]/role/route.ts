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

// PATCH - Modifier le rôle d'un utilisateur
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Seuls les ADMIN peuvent modifier les rôles
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé. Seuls les administrateurs peuvent modifier les rôles." },
        { status: 403 }
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      );
    }

    const { role } = await request.json();

    // Validation du rôle
    const validRoles = ["ADMIN", "CHEF", "REFERENT"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide. Les rôles autorisés sont : ADMIN, CHEF, REFERENT" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se retirer ses propres droits d'admin
    if (currentUser.userId === userId && currentUser.role === "ADMIN" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous ne pouvez pas retirer vos propres droits d'administrateur" },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: `Rôle de ${updatedUser.name} mis à jour vers ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du rôle:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// GET - Récupérer les informations d'un utilisateur
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Seuls les ADMIN et REFERENT peuvent voir les informations des autres utilisateurs
    if (currentUser.role !== "ADMIN" && currentUser.role !== "REFERENT") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
