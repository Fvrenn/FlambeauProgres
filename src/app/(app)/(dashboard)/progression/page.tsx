import { redirect } from "next/navigation";

import EtapeProgressCard from "./_components/EtapeProgressCard";

import { getUser } from "@/lib/auth-server";
import { DEFAULT_ETAPE_COLOR } from "@/lib/color";
import { EtapeService } from "@/services/etape.service";

export default async function ProgressionPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const etapes = await EtapeService.getProgressForChef(user.id);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-3xl font-normal">Progression</h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {etapes.map((etape) => (
          <EtapeProgressCard
            key={etape.id}
            color={etape.couleur ?? DEFAULT_ETAPE_COLOR}
            done={etape.done}
            imageSrc={etape.imageSrc}
            name={etape.name}
            number={etape.number}
            total={etape.total}
          />
        ))}
      </div>
    </div>
  );
}
