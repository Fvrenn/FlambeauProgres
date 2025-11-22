import React from "react";
import prisma from "@/src/lib/prisma";
import AssignationsClientPage from "./ClientPage";

export default async function AdminAssignationsPage() {
  const etapes = await prisma.etape.findMany({
    include: {
      referents: {
        include: {
          referent: true,
        },
      },
    },
    orderBy: {
      ordre: "asc",
    },
  });

  const allReferents = await prisma.user.findMany({
    where: {
      role: "REFERENT",
    },
    orderBy: {
      name: "asc",
    },
  });

  return <AssignationsClientPage etapes={etapes} allReferents={allReferents} />;
}
