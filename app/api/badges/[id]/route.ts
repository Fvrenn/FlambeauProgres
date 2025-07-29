import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { UpdateBadgeSchema } from "@/src/schemas/badgeSchema";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const parsed = UpdateBadgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { objectifs, ...badgeData } = parsed.data;

    const updatedBadge = await prisma.badge.update({
      where: { id: params.id },
      data: badgeData,
    });
    return NextResponse.json(updatedBadge, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }
    console.error('Badge update error:', error);
    return NextResponse.json(
      {
        error: "Failed to update badge",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const deletedBadge = await prisma.badge.delete({
      where: { id: params.id },
    });
    return NextResponse.json(deletedBadge, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }
    console.error('Badge delete error:', error);
    return NextResponse.json(
      {
        error: "Failed to delete badge",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}