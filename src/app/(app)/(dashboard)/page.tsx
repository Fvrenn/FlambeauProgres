import { redirect } from "next/navigation";

import DashboardClient from "@/app/(app)/(dashboard)/_component/DashboardClient";
import { getUser } from "@/lib/auth-server";
import { getMyNotifications } from "@/actions/notification/notification.actions";
import { EtapeService } from "@/services/etape.service";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const [etapes, notifications] = await Promise.all([
    EtapeService.getDashboardEtapesForChef(user.id),
    getMyNotifications(),
  ]);

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="hidden md:block text-3xl font-normal flex-shrink-0">
        Tableau de bord
      </h4>
      <DashboardClient etapes={etapes} notifications={notifications} />
    </div>
  );
}
