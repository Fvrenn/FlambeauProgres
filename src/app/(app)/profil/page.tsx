import ClientPage from "./ClientPage";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { WpProgressionService } from "@/services/wp-progression.service";

export const metadata = {
  title: "Profil | Flambeau Progres",
};

export default async function ProfilPage() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const progression = await WpProgressionService.getEtat(user.id);

  return <ClientPage progression={progression} user={user} />;
}
