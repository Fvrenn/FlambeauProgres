import ClientPage from "./ClientPage";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { buildWpProfileUrl } from "@/lib/wp-redirect";
import { WpProgressionService } from "@/services/wp-progression.service";

export const metadata = {
  title: "Profil",
};

export default async function ProfilPage() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const progression = await WpProgressionService.getEtat(user.id);

  return (
    <ClientPage
      progression={progression}
      user={user}
      wordpressProfileUrl={buildWpProfileUrl()}
    />
  );
}
