import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const VALID_ROLES = ['ADMIN', 'CHEF', 'REFERENT'] as const;

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    
    // Validation des données d'entrée
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" }, 
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: "Format d'email invalide" }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" }, 
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide" }, 
        { status: 400 }
      );
    }
    
    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" }, 
        { status: 409 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}
