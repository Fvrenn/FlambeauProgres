import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const referents = await prisma.user.findMany({
      where: { role: "REFERENT" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return NextResponse.json(referents, { status: 200 });
  } catch (error: any) {
    console.error("Referent fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referents" },
      { status: 500 }
    );
  }
}