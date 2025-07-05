import { title, subtitle } from "@/components/primitives";

export const CardChemise = () => {
  return (
    <section className="bg-dark-beige w-full p-0.5 rounded-3xl">
      <div className="pt-6 pb-3.5 flex justify-center">
        ouai oui
      </div>
      <div className="bg-light-beige w-full rounded-3xl border border-border-beige p-7">
        <div className="grid grid-cols-3 gap-4 place-items-center">
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2b-spe_PF.svg" alt="Badge PF" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2c-spe_F.svg" alt="Badge F" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2e-spe_animation.svg" alt="Badge Animation" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2f-spe_communication.svg" alt="Badge Communication" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2g-spe_construction.svg" alt="Badge Construction" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2h-spe_cuisine.svg" alt="Badge Cuisine" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2i-spe_explo.svg" alt="Badge Exploration" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2j-spe_intendance.svg" alt="Badge Intendance" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2k-spe_materiel.svg" alt="Badge Matériel" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2l-spe_nature.svg" alt="Badge Nature" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2m-sante.svg" alt="Badge Santé" />
        <img className="max-w-[67px] max-h-[77px]" src="/badges/2n-spe_vie_spi.svg" alt="Badge Vie Spirituelle" />
      </div>
      </div>
    </section>
  );
};