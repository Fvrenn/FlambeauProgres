import { CardChemise } from "@/components/home/cardchemise/CardEtapes";
import ControlPanel from "@/components/home/cardcontrolpanel/ControlPanel";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-start h-full gap-4 py-8 md:py-10">
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <div><strong>Email :</strong> {user?.email || "Non renseigné"}</div>
      </div>
      <div className="flex items-center gap-4">
        <CardChemise />
        <ControlPanel />
      </div>
    </div>
  );
}