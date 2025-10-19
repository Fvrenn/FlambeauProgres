import { title, subtitle } from "@/components/primitives";
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
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Bienvenue sur votre tableau de bord</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Ceci est le contenu de votre page d'accueil.
        </h2>
        {/* Ajoutez ici le contenu spécifique à votre page d'accueil du tableau de bord */}
        {/* Par exemple, la vue d'ensemble des badges, la progression globale, etc. */}
      </div>
    </section>
  );
}
