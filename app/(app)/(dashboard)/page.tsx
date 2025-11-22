import prisma from "@/src/lib/prisma";
import DashboardClient from "@/app/(app)/(dashboard)/_component/DashboardClient";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import { getMyNotifications } from "@/app/actions/notification-actions";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const [etapes, notifications] = await Promise.all([
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
              include: {
                // commentaires: { ... } -> Removed for Lazy Loading
              },
            },
          },
        },
      },
    }),
    getMyNotifications(),
  ]);

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0">Tableau de bord</h4>
      <DashboardClient etapes={etapes} notifications={notifications} />
    </div>
  );
}