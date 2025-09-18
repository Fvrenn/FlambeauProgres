import React from "react";
import { Selection } from "@heroui/react";
import { CustomTextarea } from "@/src/components/ui/Textarea";
import { CustomDatePicker } from "@/src/components/ui/DatePicker";
import { CustomSelect } from "@/src/components/ui/Select";
import FileUploader from "./FileUploader";
import type { DateValue } from "@internationalized/date";

interface FormState {
  activiteDescription: string;
  dateActivite: DateValue | undefined;
  dureeHeures: number | undefined;
  contexte: string;
  nombreJeunes: string;
  trancheAge: string;
  niveau: string;
  objectifsAtteints: string;
}

interface Competence {
  code: string;
  description: string;
  type: "COMPETENCE" | "REALISATION";
  fichiersRequis?: boolean;
}

interface JustificationTabProps {
  form: FormState;
  competence: Competence;
  uploadedFiles: File[];
  isSubmitting: boolean;
  statut: "BROUILLON" | "SOUMISE";
  onFieldChange: (field: keyof FormState, value: any) => void;
  onSelectionChange: (field: keyof FormState, keys: Selection) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onConfirmSubmit: () => void;
}

const nbJeunes = [
  { key: "1-5", label: "1-5" },
  { key: "5-10", label: "5-10" },
  { key: "10-15", label: "10-15" },
  { key: "15-20", label: "15-20" },
];

const Tranche = [
  { key: "7-8", label: "7-8 ans" },
  { key: "9-11", label: "9-11 ans" },
  { key: "11-15", label: "11-15 ans" },
  { key: "15-17", label: "15-17 ans" },
];

const niveau = [
  { key: "Débutant", label: "Débutant" },
  { key: "Intermédiaire", label: "Intermédiaire" },
  { key: "Avancé", label: "Avancé" },
];

export default function JustificationTab({
  form,
  competence,
  uploadedFiles,
  isSubmitting,
  statut,
  onFieldChange,
  onSelectionChange,
  onFileUpload,
  onRemoveFile,
  onConfirmSubmit,
}: JustificationTabProps) {
  return (
    <div>
      <div className="mb-9">
        {competence.type === "REALISATION"
          ? "Justification de la réalisation"
          : "Justification de la compétence"}
      </div>

      <div className="flex flex-col gap-7">
        <section>
          <h3 className="font-medium text-base mb-4">Quoi&nbsp;?</h3>
          <CustomTextarea
            theme="default"
            label="Description"
            labelPlacement="inside"
            placeholder="Entrez la justification ici..."
            description={
              competence.type === "REALISATION"
                ? "💡 Exemple : Création d'un projet nature avec recyclage"
                : "💡 Exemple : Atelier nœuds de 2h avec jeux et défis"
            }
            minRows={3}
            maxRows={10}
            value={form.activiteDescription}
            onValueChange={(value) =>
              onFieldChange("activiteDescription", value)
            }
          />
        </section>

        <section>
          <h3 className="font-medium text-base mb-4">Quand&nbsp;?</h3>
          <div className="flex flex-col gap-4">
            <CustomDatePicker
              theme="default"
              labelPlacement="inside"
              label="Date de l'activité"
              showMonthAndYearPickers
              value={form.dateActivite}
              onChange={(date) => onFieldChange("dateActivite", date)}
            />
            <CustomTextarea
              theme="default"
              label="Contexte"
              labelPlacement="inside"
              placeholder="Entrez le contexte ici..."
              description="💡 Exemple : Camp rallye 2025"
              minRows={3}
              maxRows={10}
              value={form.contexte}
              onValueChange={(value) => onFieldChange("contexte", value)}
            />
          </div>
        </section>

        <section>
          <h3 className="font-medium text-base mb-4">Avec qui&nbsp;?</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <CustomSelect
                theme="default"
                label="Nombre de jeunes"
                labelPlacement="inside"
                placeholder="Sélectionnez un nombre"
                options={nbJeunes}
                selectedKeys={
                  form.nombreJeunes
                    ? new Set([form.nombreJeunes])
                    : new Set()
                }
                onSelectionChange={(keys) =>
                  onSelectionChange("nombreJeunes", keys)
                }
              />
              <CustomSelect
                theme="default"
                label="Tranche d'âge"
                labelPlacement="inside"
                placeholder="Sélectionnez une tranche"
                options={Tranche}
                selectedKeys={
                  form.trancheAge ? new Set([form.trancheAge]) : new Set()
                }
                onSelectionChange={(keys) =>
                  onSelectionChange("trancheAge", keys)
                }
              />
              <CustomSelect
                theme="default"
                label="Niveau"
                labelPlacement="inside"
                placeholder="Sélectionnez un niveau"
                options={niveau}
                selectedKeys={
                  form.niveau ? new Set([form.niveau]) : new Set()
                }
                onSelectionChange={(keys) =>
                  onSelectionChange("niveau", keys)
                }
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-medium text-base mb-4">Résultats&nbsp;?</h3>
          <CustomTextarea
            theme="default"
            label="Objectifs atteints"
            labelPlacement="inside"
            placeholder="Entrez les objectifs qui ont été atteints"
            description="💡 Exemple : La plupart des jeunes maîtrisent"
            minRows={3}
            maxRows={10}
            value={form.objectifsAtteints}
            onValueChange={(value) =>
              onFieldChange("objectifsAtteints", value)
            }
          />
        </section>

        {/* Section d'upload pour les réalisations */}
        {(competence.type === "REALISATION" || competence.fichiersRequis) && (
          <FileUploader
            uploadedFiles={uploadedFiles}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
          />
        )}

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirmSubmit}
            disabled={isSubmitting || statut === "SOUMISE"}
          >
            {isSubmitting ? "Soumission..." : "Soumettre"}
          </button>
        </div>
      </div>
    </div>
  );
}