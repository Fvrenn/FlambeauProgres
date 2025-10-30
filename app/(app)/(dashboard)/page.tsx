import { title, subtitle } from "@/components/primitives";
import ContentChemise from "@/components/dashboard/contentChemise/contentChemise";
import ContentAction from "@/components/dashboard/contentAction/contentAction";
// import { getUser } from "@/src/lib/auth-server"; // Décommenter si nécessaire pour le contenu de la page
// import { headers } from "next/headers"; // Décommenter si nécessaire pour le contenu de la page
// import { redirect } from "next/navigation"; // Décommenter si nécessaire pour le contenu de la page
// import { auth } from "@/src//lib/auth"; // Décommenter si nécessaire pour le contenu de la page
// Les imports de Sidebar, sectionNestedItems, Avatar, Button, ScrollShadow, Spacer ne sont plus nécessaires ici
// car ils sont maintenant dans le layout.

export default async function Home() {
  // Le code d'authentification commenté peut être réactivé si nécessaire pour cette page spécifique
  // const user = await getUser();
  // if (!user) {
  //   redirect("/login");
  // }
  return (
    <div className="h-full flex flex-col">
      <h4 className="text-3xl font-normal">Tableau de bord</h4>
      <div className="flex items-center flex-1 gap-4 pt-4">
        <ContentChemise />
        <ContentAction />
      </div>
    </div>
  );
}
