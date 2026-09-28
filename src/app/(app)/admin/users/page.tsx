import React from "react";

import UsersClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { UserService } from "@/services/user.service";

export default async function AdminUsersPage() {
  await exigerRole(...ROLES_ADMIN);

  const users = await UserService.listForAdmin();

  return <UsersClientPage users={users} />;
}
