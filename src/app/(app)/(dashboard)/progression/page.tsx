import Link from "next/link";

import EtapeProgressCard from "./_components/EtapeProgressCard";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";
import { DEFAULT_ETAPE_COLOR } from "@/lib/color";
import { EtapeService } from "@/services/etape.service";

export default async function ProgressionPage() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  const etapes = (await EtapeService.getProgressForChef(user.id)).filter(
    (etape) => etape.type === "BADGE",
  );

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-3xl font-extrabold">Progression</h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {etapes.map((etape) => (
          <Link
            key={etape.id}
            aria-label={`Ouvrir l'étape ${etape.name} dans le tableau de bord`}
            className="block h-full rounded-large outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            href={`/?etape=${encodeURIComponent(etape.id)}`}
          >
            <EtapeProgressCard
              color={etape.couleur ?? DEFAULT_ETAPE_COLOR}
              done={etape.done}
              imageSrc={etape.imageSrc}
              name={etape.name}
              number={etape.number}
              total={etape.total}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
