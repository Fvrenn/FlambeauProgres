import React from "react";

import AssignationsClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

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

  return <AssignationsClientPage allReferents={allReferents} etapes={etapes} />;
}
