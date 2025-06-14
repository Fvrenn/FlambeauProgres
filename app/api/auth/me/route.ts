import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}
