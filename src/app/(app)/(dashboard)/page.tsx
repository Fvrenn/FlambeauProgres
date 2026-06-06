import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import DashboardClient from "@/app/(app)/(dashboard)/_component/DashboardClient";
import { getUser } from "@/lib/auth-server";
import { getMyNotifications } from "@/actions/notification/notification.actions";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const [etapes, notifications, statutsValides] = await Promise.all([
    prisma.etape.findMany({
      orderBy: {
        ordre: "asc",
      },
      include: {
        objectifs: {
          include: {
            justifications: {
              where: {
                chefId: user.id,
              },
              include: {},
            },
          },
        },
      },
    }),
    getMyNotifications(),
    prisma.chefEtapeStatut.findMany({
      where: { chefId: user.id, statut: "VALIDE" },
      select: { etapeId: true },
    }),
  ]);

  const etapesIdsValidees = new Set(statutsValides.map((s) => s.etapeId));
  const etapesAvecStatut = etapes.map((etape) => ({
    ...etape,
    isValidated: etapesIdsValidees.has(etape.id),
  }));

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="hidden md:block text-3xl font-normal flex-shrink-0">
        Tableau de bord
      </h4>
      <DashboardClient etapes={etapesAvecStatut} notifications={notifications} />
    </div>
  );
}
