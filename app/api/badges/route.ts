import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const badges = await prisma.badges.findMany({
    include: {
      competences: true,
      realisations: true,
    },
  });
  return NextResponse.json(badges);
}

export async function POST(request: Request) {
  const data = await request.json();
  const badge = await prisma.badges.create({
    data: {
      name: data.name,
      number: data.number,
      description: data.description,
      image_src: data.image_src,
      competences: {
        create: data.competences || [],
      },
      realisations: {
        create: data.realisations || [],
      },
    },
    include: {
      competences: true,
      realisations: true,
    },
  });
  return NextResponse.json(badge);
}