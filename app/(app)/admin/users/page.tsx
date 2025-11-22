import React from "react";
import prisma from "@/src/lib/prisma";
import UsersClientPage from "./ClientPage";

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

  return <UsersClientPage users={users} troupes={troupes} />;
}
