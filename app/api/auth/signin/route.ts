import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validation des données d'entrée
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" }, 
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: "Format d'email invalide" }, 
        { status: 400 }
      );
    }
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides" }, 
        { status: 401 }
      );
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Identifiants invalides" }, 
        { status: 401 }
      );
    }
    
    // Vérifier que JWT_SECRET existe
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET n'est pas défini");
      return NextResponse.json(
        { error: "Erreur de configuration du serveur" }, 
        { status: 500 }
      );
    }
    
    // Créer le JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      jwtSecret,
      { expiresIn: "24h" }
    );
    
    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}
