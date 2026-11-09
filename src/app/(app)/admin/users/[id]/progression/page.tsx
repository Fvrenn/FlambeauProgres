import { redirect } from "next/navigation";

import ProgressionClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { ProgressionAdminService } from "@/services/progression-admin.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProgressionUtilisateurPage({
  params,
}: PageProps) {
  await exigerRole(...ROLES_ADMIN);

  const { id } = await params;
  const progression = await ProgressionAdminService.getPourUtilisateur(id);

  if (!progression) {
    redirect("/admin/users");
  }

  return <ProgressionClientPage {...progression} />;
}
