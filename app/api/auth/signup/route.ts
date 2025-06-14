import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: `${firstName} ${lastName}`,
      role: "CHEF",
    },
  });
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
