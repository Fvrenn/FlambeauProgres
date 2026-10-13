import ClientPage from "./ClientPage";

import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { buildWpProfileUrl } from "@/lib/wp-redirect";
import { getWpProfile } from "@/lib/wordpress-profile";
import { AccueilService } from "@/services/accueil.service";
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

  const [progression, accueil] = await Promise.all([
    WpProgressionService.getEtat(user.id),
    AccueilService.getEtat(user.id, getWpProfile(user)?.groupValue ?? null),
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <ClientPage
        accueil={accueil}
        progression={progression}
        user={user}
        wordpressProfileUrl={buildWpProfileUrl()}
      />
    </>
  );
}
