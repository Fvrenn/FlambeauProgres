import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ referentId: string }> } // Changed: params is now a Promise
) {
  const { referentId } = await params; // Changed: await params before destructuring

  try {
    const assignedBadges = await prisma.badgeReferent.findMany({
      where: { referentId },
      select: { badgeId: true },
    });
    const badgeIds = assignedBadges.map((br) => br.badgeId);

    if (badgeIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const justifications = await prisma.justification.findMany({
      where: {
        badgeId: { in: badgeIds },
        statut: { not: "BROUILLON" },
      },
      include: {
        chef: {
          select: { id: true, name: true, email: true, image: true },
        },
        badge: {
          select: { id: true, name: true },
        },
        objectif: {
          select: { id: true, code: true, description: true },
        },
      },
      orderBy: { soumiseAt: "desc" },
    });

    return NextResponse.json(justifications, { status: 200 });
  } catch (error: any) {
    console.error("Erreur fetch justifications référent:", error);
    return NextResponse.json(
      { error: "Impossible de charger les justifications", details: error.message },
      { status: 500 }
    );
  }
}