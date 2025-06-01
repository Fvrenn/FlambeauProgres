import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  await prisma.competences.deleteMany({ where: { badge_id: Number(params.id) } });
  await prisma.realisations.deleteMany({ where: { badge_id: Number(params.id) } });
  const badge = await prisma.badges.update({
    where: { id: Number(params.id) },
    data: {
      competences: {
        create: data.competences || [],
      },
      realisations: {
        create: data.realisations || [],
      },
    },
    include: {
      competences: true,
      realisations: true,
    },
  });

  return NextResponse.json(badge);
}


// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   await prisma.badges.delete({
//     where: { id: Number(params.id) },
//   });
//   return NextResponse.json({ success: true });
// }