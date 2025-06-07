import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const badges = await prisma.badges.findMany({
      include: {
        competences: {
          select: {
            id: true,
            description: true,
          },
        },
        realisations: {
          select: {
            id: true,
            description: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    return NextResponse.json(badges);
  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validation des données requises
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: "Le nom et la description sont requis" },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du numéro s'il est fourni
    if (data.number) {
      const existingBadge = await prisma.badges.findFirst({
        where: { number: data.number },
      });

      if (existingBadge) {
        return NextResponse.json(
          { error: "Ce numéro de badge existe déjà" },
          { status: 409 }
        );
      }
    }

    const badge = await prisma.badges.create({
      data: {
        name: data.name,
        number: data.number,
        description: data.description,
        image_src: data.image_src,
        competences: {
          create:
            data.competences?.map((comp: any) => ({
              description: comp.description,
            })) || [],
        },
        realisations: {
          create:
            data.realisations?.map((real: any) => ({
              description: real.description,
            })) || [],
        },
      },
      include: {
        competences: true,
        realisations: true,
      },
    });

    return NextResponse.json(badge, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du badge:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}