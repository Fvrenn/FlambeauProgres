import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const badge = await prisma.badge.findUnique({
      where: { id: params.id },
      include: {
        competences: true,
        realisations: true,
      },
    });
    
    if (!badge) {
      return NextResponse.json({ error: "Badge non trouvé" }, { status: 404 });
    }
    
    return NextResponse.json(badge);
  } catch (error) {
    console.error("Erreur lors de la récupération du badge:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du badge" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    
    const badge = await prisma.badge.update({
      where: { id: params.id },
      data: {
        name: data.name,
        number: data.number,
        description: data.description,
        image_src: data.image_src,
      },
      include: {
        competences: true,
        realisations: true,
      },
    });
    
    return NextResponse.json(badge);
  } catch (error) {
    console.error("Erreur lors de la modification du badge:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du badge" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.badge.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du badge:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du badge" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}