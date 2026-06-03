import React from "react";

import UsersClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      troupe: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const troupes = await prisma.troupe.findMany({
    orderBy: {
      nom: "asc",
    },
  });

  return <UsersClientPage troupes={troupes} users={users} />;
}
