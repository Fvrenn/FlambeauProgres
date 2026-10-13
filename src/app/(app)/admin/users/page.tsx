import UsersClientPage from "./ClientPage";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { UserService } from "@/services/user.service";

export default async function AdminUsersPage() {
  await exigerRole(...ROLES_ADMIN);

  const users = await UserService.listForAdmin();

  return (
    <>
      <RafraichissementArrierePlan />
      <UsersClientPage users={users} />
    </>
  );
}
