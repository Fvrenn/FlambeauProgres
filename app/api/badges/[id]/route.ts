import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const BadgeSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  image_src: z.string().optional(),
  ordre: z.number().int().positive(),
  objectifs: z.array(
    z.object({
      code: z.string().min(1),
      description: z.string(),
      type: z.enum(["COMPETENCE", "REALISATION"]),
    })
  ),
});
const UpdateBadgeSchema = BadgeSchema.partial();

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

    const updatedBadge = await prisma.badge.update({
      where: { id: params.id },
      data: parsed.data,
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