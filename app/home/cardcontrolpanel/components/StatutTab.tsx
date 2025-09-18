import React from "react";
import { CustomCheckbox } from "@/src/components/ui/Checkbox";
import ProgressBar from "@/src/components/ui/Progress";
import type { Badge } from "@/src/types/badge";

interface FormState {
  activiteDescription: string;
}

interface Competence {
  type: "COMPETENCE" | "REALISATION";
}

interface StatutTabProps {
  badge: Badge;
  competence: Competence;
  form: FormState;
  statut: "BROUILLON" | "SOUMISE";
  uploadedFiles: File[];
}

export default function StatutTab({
  badge,
  competence,
  form,
  statut,
  uploadedFiles,
}: StatutTabProps) {
  return (
    <div>
      <div className="bg-[#f5f4ed] py-2.5 px-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <img
            className="max-w-14 h-16"
            src={badge.image_src}
            alt={`Badge ${badge.name}`}
          />
          <ProgressBar percentage={10} label={`Etapes ${badge.name}`} />
        </div>

        <hr className="border-light-grey mt-4 mb-5 mx-3" />

        <div className="flex flex-col gap-1">
          <CustomCheckbox
            theme="modal"
            defaultSelected={!!form.activiteDescription}
            disabled
            className="text-white"
          >
            Justification rédigée
          </CustomCheckbox>
          {competence.type === "REALISATION" && (
            <CustomCheckbox
              theme="modal"
              className="text-white"
              defaultSelected={uploadedFiles.length > 0}
              disabled
            >
              Fichiers joints
            </CustomCheckbox>
          )}
          <CustomCheckbox
            theme="modal"
            defaultSelected={statut === "SOUMISE"}
            disabled
            className="text-white"
          >
            Soumission effectuée
          </CustomCheckbox>
          <CustomCheckbox
            theme="modal"
            disabled
            defaultSelected={false}
            className="text-white"
          >
            Précisions demandées
          </CustomCheckbox>
        </div>
      </div>
    </div>
  );
}