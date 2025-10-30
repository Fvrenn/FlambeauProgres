import ContentChemise from "@/components/dashboard/contentChemise/contentChemise";
import ContentAction from "@/components/dashboard/contentAction/contentAction";
import prisma from "@/src/lib/prisma";

export default async function Home() {
  // ...existing code...
  // if (!user) {
  //   redirect("/login");
  // }

  const etapes = await prisma.etape.findMany({
    orderBy: {
      ordre: "asc",
    },
  });

  return (
    <div className="h-full flex flex-col">
      <h4 className="text-3xl font-normal">Tableau de bord</h4>
      <div className="flex items-center flex-1 gap-4 pt-4">
        {/* On passe les données récupérées au composant client via les props */}
        <ContentChemise etapes={etapes} />
        <ContentAction />
      </div>
    </div>
  );
}