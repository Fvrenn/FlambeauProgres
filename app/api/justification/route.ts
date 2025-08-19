import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import type { Justification } from "@/src/types/justification";
import { JustificationShema } from "@/src/schemas/justification.shema";

export async function GET(request: Request) {
  try {
    const justifications = await prisma.justification.findMany();
    return NextResponse.json(justifications, { status: 200 });
  } catch (error: any) {
    console.error("Justification fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch justifications",
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

    const parsed = JustificationShema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      chefId,
      objectifId,
      badgeId,
      activiteDescription,
      dateActivite,
      dureeHeures,
      contexte,
      nombreJeunes,
      trancheAge,
      niveau,
      objectifsAtteints,
    }: Justification = parsed.data;

    const newJustification = await prisma.justification.create({
      data: {
        chefId,
        objectifId,
        badgeId,
        activiteDescription,
        dateActivite: dateActivite ? new Date(dateActivite) : undefined,
        dureeHeures,
        contexte,
        nombreJeunes,
        trancheAge,
        niveau,
        objectifsAtteints,
      },
    });

    return NextResponse.json(newJustification, { status: 201 });
  } catch (error: any) {
    console.error("Justification creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create justification",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
