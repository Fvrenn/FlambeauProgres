import React from "react";

import TroupesClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

export default async function AdminTroupesPage() {
  const troupes = await prisma.troupe.findMany({
    include: {
      membres: {
        take: 5,
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      _count: {
        select: { membres: true },
      },
    },
    orderBy: {
      nom: "asc",
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <TroupesClientPage troupes={troupes} users={users} />;
}
