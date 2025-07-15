import { CardChemise } from "@/components/home/cardchemise/CardEtapes";
import ControlPanel from "@/components/home/cardcontrolpanel/ControlPanel";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";
export default function Home() {
  const user = getUser();

  if (!user) {
    redirect("/auth/login");
  }
  return (
    <div className="flex items-center h-full gap-4 py-8 md:py-10">
      <CardChemise />
      <ControlPanel />
    </div>
  );
}
