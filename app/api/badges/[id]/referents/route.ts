import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  try {
    const { referentId } = await request.json();
    if (!referentId) {
      return NextResponse.json({ error: "referentId requis" }, { status: 400 });
    }

    await prisma.badgeReferent.create({
      data: {
        badgeId: id,
        referentId,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Assignation référent erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'assignation du référent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { referentId } = await request.json();
  if (!referentId) {
    return NextResponse.json({ error: "referentId requis" }, { status: 400 });
  }

  try {
    await prisma.badgeReferent.deleteMany({
      where: {
        badgeId: id,
        referentId,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur suppression référent:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du référent" },
      { status: 500 }
    );
  }
}