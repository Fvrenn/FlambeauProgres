import { redirect } from "next/navigation";

import FormationClientPage from "./ClientPage";

import { getUser } from "@/lib/auth-server";
import { FormationService } from "@/services/formation.service";

export default async function FormationPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const formations = await FormationService.list();

  return (
    <div className="h-full flex flex-col gap-6">
      <h4 className="text-3xl font-extrabold flex-shrink-0">Formation</h4>
      <FormationClientPage formations={formations} />
    </div>
  );
}
