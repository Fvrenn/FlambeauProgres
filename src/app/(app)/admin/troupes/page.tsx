import React from "react";

import TroupesClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

export default async function AdminTroupesPage() {
  const troupes = await prisma.troupe.findMany({
    include: {
      membres: {
        take: 5, // Limit members fetched for display
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

  // Fetch users to populate the "Assign Chef" select
  // We might want to filter this list in a real app, but for now fetch all
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
