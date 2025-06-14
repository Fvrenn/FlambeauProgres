import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const res = NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
