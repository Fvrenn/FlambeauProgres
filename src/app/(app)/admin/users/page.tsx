import React from "react";

import UsersClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <UsersClientPage users={users} />;
}
