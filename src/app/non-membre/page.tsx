import { ROUTE_DECONNEXION } from "@/config/navigation";

export const metadata = {
  title: "Accès réservé aux membres",
};

export default function NonMembrePage() {
  return (
    <div className="bg-dashboard flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">
        Accès réservé aux membres de la plateforme
      </h1>
      <p className="max-w-md text-default-500">
        Vous êtes bien connecté, mais votre compte n&apos;est pas encore membre
        de la plateforme Flambeaux. Demandez à un responsable de vous y ajouter,
        puis reconnectez-vous.
      </p>
      <a
        className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        href={ROUTE_DECONNEXION}
      >
        Se déconnecter
      </a>
    </div>
  );
}
