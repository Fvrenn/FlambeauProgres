import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Récupérer la session avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Non authentifié" 
      }, { status: 401 });
    }

    const { userId, role } = await request.json();
    
    // Validation
    if (!userId || !role) {
      return NextResponse.json({ 
        error: "userId et role sont requis" 
      }, { status: 400 });
    }

    // Empêcher un utilisateur de changer son propre rôle
    if (session.user.id === userId) {
      return NextResponse.json({ 
        error: "Vous ne pouvez pas modifier votre propre rôle" 
      }, { status: 403 });
    }

    const validRoles = ["ADMIN", "CHEF", "REFERENT"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: "Rôle invalide" 
      }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ 
        error: "Utilisateur non trouvé" 
      }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("User update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update user",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}