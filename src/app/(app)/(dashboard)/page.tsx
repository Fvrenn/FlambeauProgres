import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import DashboardClient from "@/app/(app)/(dashboard)/_component/DashboardClient";
import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { getMyNotifications } from "@/actions/notification/notification.actions";
import { EtapeService } from "@/services/etape.service";
import { NotificationService } from "@/services/notification.service";
import { getWpProfile } from "@/lib/wordpress-profile";
import { AccueilService } from "@/services/accueil.service";
import { AccueilPremiereConnexion } from "@/components/application/accueil/AccueilPremiereConnexion";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const wp = getWpProfile(user);
  const [etapes, notifications, signature, accueil] = await Promise.all([
    EtapeService.getDashboardEtapesForChef(user.id),
    getMyNotifications(),
    NotificationService.getSignature(user.id),
    user.accueilTermineAt === null
      ? AccueilService.getEtat(user.id, wp?.groupValue ?? null)
      : null,
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <RafraichissementSurNotification signature={signature} />
      {accueil && <AccueilPremiereConnexion etat={accueil} />}
      <div className="h-full flex flex-col overflow-hidden">
        <h4 className="hidden md:block text-3xl font-extrabold flex-shrink-0">
          Tableau de bord
        </h4>
        <DashboardClient
          branche={wp?.branche ?? null}
          etapes={etapes}
          notifications={notifications}
          viewer={{
            id: user.id,
            name: user.name,
            image: user.image ?? null,
            role: "role" in user ? user.role : undefined,
          }}
        />
      </div>
    </>
  );
}
