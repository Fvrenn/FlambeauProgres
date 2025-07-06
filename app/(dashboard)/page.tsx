import { CardChemise } from "@/components/home/cardchemise/CardEtapes";
import ControlPanel from "@/components/home/cardcontrolpanel/ControlPanel";
export default function Home() {
  return (
    <div className="flex items-center h-full gap-4 py-8 md:py-10">
      <CardChemise />
      <ControlPanel />
    </div>
  );
}