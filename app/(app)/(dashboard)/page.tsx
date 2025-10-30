import prisma from "@/src/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Home() {
  // ...existing code...
  // if (!user) {
  //   redirect("/login");
  // }

  const etapes = await prisma.etape.findMany({
    orderBy: {
      ordre: "asc",
    },
    // IMPORTANT : On inclut les objectifs directement pour éviter des requêtes en cascade
    include: {
      objectifs: true,
    },
  });

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0">Tableau de bord</h4>
      <DashboardClient etapes={etapes} />
    </div>
  );
}