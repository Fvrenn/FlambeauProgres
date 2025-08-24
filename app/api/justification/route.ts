import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import {
  JustificationShema,
  JustificationUpdateSchema,
} from "@/src/schemas/justification.shema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Justification POST body:", body); // Ajoute ce log

    const parsed = JustificationShema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Zod", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const newJustification = await prisma.justification.create({
      data: {
        ...data,
        dateActivite: data.dateActivite
          ? new Date(data.dateActivite)
          : undefined,
        soumiseAt: data.statut === "SOUMISE" ? new Date() : undefined,
      },
    });

    return NextResponse.json(newJustification, { status: 201 });
  } catch (error: any) {
    console.error("Erreur Prisma:", error); // Ajoute ce log
    return NextResponse.json(
      { error: "Erreur création justification", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = JustificationUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Zod", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: any = { statut: data.statut };
    if (data.statut === "SOUMISE") {
      updateData.soumiseAt = new Date();
    }

    const justification = await prisma.justification.update({
      where: { id: data.id },
      data: updateData,
    });

    return NextResponse.json(justification, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur update justification", details: error.message },
      { status: 500 }
    );
  }
}
