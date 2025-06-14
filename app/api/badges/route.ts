import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      include: {
        competences: true,
        realisations: true,
      },
    });
    return NextResponse.json(badges);
  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des badges" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const badge = await prisma.badge.create({
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
  } catch (error) {
    console.error("Erreur lors de la création du badge:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du badge" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}