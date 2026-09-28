import React from "react";

import UsersClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  await exigerRole(...ROLES_ADMIN);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <UsersClientPage users={users} />;
}
