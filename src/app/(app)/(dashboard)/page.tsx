import { RafraichissementArrierePlan } from "@/components/application/rafraichissement/RafraichissementArrierePlan";
import { RafraichissementSurNotification } from "@/components/application/rafraichissement/RafraichissementSurNotification";
import DashboardClient from "@/app/(app)/(dashboard)/_component/DashboardClient";
import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { getMyNotifications } from "@/actions/notification/notification.actions";
import { EtapeService } from "@/services/etape.service";
import { NotificationService } from "@/services/notification.service";
import { getWpProfile } from "@/lib/wordpress-profile";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const [etapes, notifications, signature] = await Promise.all([
    EtapeService.getDashboardEtapesForChef(user.id),
    getMyNotifications(),
    NotificationService.getSignature(user.id),
  ]);

  return (
    <>
      <RafraichissementArrierePlan />
      <RafraichissementSurNotification signature={signature} />
      <div className="h-full flex flex-col overflow-hidden">
        <h4 className="hidden md:block text-3xl font-extrabold flex-shrink-0">
          Tableau de bord
        </h4>
        <DashboardClient
          branche={getWpProfile(user)?.branche ?? null}
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
