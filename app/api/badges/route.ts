import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { BadgeSchema } from "@/src/schemas/badge.schema";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    const badges = await prisma.badge.findMany({
      include: {
        objectifs: {
          select: {
            id: true,        
            code: true,
            description: true,
            type: true,
            fichiersRequis: true,
            justifications: session?.user ? {
              where: { chefId: session.user.id },
              select: {
                id: true,
                statut: true,
                soumiseAt: true,
                valideeAt: true,
              }
            } : false
          }
        },
        referents: {
          include: {
            referent: true,
          },
        },
      },
    });

    const formattedBadges = badges.map((badge) => ({
      ...badge,
      assignedReferents: badge.referents.map((br) => br.referent),
    }));

    return NextResponse.json(formattedBadges, { status: 200 });
  } catch (error: any) {
    console.error("Badge fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch badges",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = BadgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { number, name, description, image_src, ordre, objectifs } =
      parsed.data;

    const newBadge = await prisma.badge.create({
      data: {
        number,
        name,
        description,
        image_src,
        ordre,
        objectifs: {
          create: objectifs.map((obj) => ({
            code: obj.code,
            description: obj.description,
            type: obj.type,
          })),
        },
      },
    });

    return NextResponse.json(newBadge, { status: 201 });
  } catch (error: any) {
    console.error("Badge creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create badge",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
