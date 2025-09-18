import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { Selection } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useSession } from "@/src/lib/auth-client";
import { useJustification } from "@/src/hooks/useJustification";
import { saveJustification, updateJustificationStatut } from "@/src/lib/justification";
import type { Badge } from "@/src/types/badge";
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

interface UseMaModalLogicParams {
  badge: Badge;
  competence: Competence;
  isOpen: boolean;
}

export function useMaModalLogic({ badge, competence, isOpen }: UseMaModalLogicParams) {
  const { data: session } = useSession();
  const chefId = session?.user?.id ?? "";
  
  const objectif = badge.objectifs.find((o) => o.code === competence.code);
  const objectifId = objectif?.id ?? "";

  const { useDraft } = useJustification();
  const {
    data: draft,
    isLoading,
    refetch,
  } = useDraft(badge.id, objectifId, chefId);

  const {
    saveJustification: saveJustificationHook,
    submitJustification,
    isSaving,
    isSubmitting,
    saveError,
    submitError,
  } = useJustification();

  const initialFormState: FormState = {
    activiteDescription: "",
    dateActivite: undefined,
    dureeHeures: undefined,
    contexte: "",
    nombreJeunes: "",
    trancheAge: "",
    niveau: "",
    objectifsAtteints: "",
  };

  const [form, setForm] = useState<FormState>(initialFormState);
  const [statut, setStatut] = useState<"BROUILLON" | "SOUMISE">("BROUILLON");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"justification" | "commentaire" | "statut">("justification");

  // Vérifie si le formulaire a du contenu
  const hasFormContent = () => {
    return (
      form.activiteDescription.trim() !== "" ||
      form.dateActivite !== undefined ||
      form.dureeHeures !== undefined ||
      form.contexte.trim() !== "" ||
      form.nombreJeunes !== "" ||
      form.trancheAge !== "" ||
      form.niveau !== "" ||
      form.objectifsAtteints.trim() !== "" ||
      uploadedFiles.length > 0
    );
  };

  // Formate les données du formulaire pour l'API
  const formatFormData = () => {
    return {
      activiteDescription: form.activiteDescription,
      dateActivite: form.dateActivite ? form.dateActivite.toString() : "",
      dureeHeures: form.dureeHeures,
      contexte: form.contexte,
      nombreJeunes: form.nombreJeunes,
      trancheAge: form.trancheAge,
      niveau: form.niveau,
      objectifsAtteints: form.objectifsAtteints,
      chefId,
      objectifId,
      badgeId: badge.id,
    };
  };

  // Sauvegarde automatique
  const autoSave = async () => {
    if (hasFormContent() && statut !== "SOUMISE") {
      try {
        const formattedData = formatFormData();
        if (draft && draft.id) {
          await updateJustificationStatut(draft.id, "BROUILLON");
        } else {
          await saveJustification(formattedData);
        }

        addToast({
          title: "Brouillon sauvegardé",
          description: `Brouillon pour la compétence ${competence.code} du badge ${badge.name} sauvegardé`,
          variant: "solid",
          color: "success",
        });

        console.log("Brouillon sauvegardé automatiquement");
      } catch (error) {
        addToast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder le brouillon",
          variant: "solid",
          color: "danger",
        });
      }
    }
  };

  // Gestion des changements de champ
  const handleFieldChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gestion des changements de sélection
  const handleSelectionChange = (field: keyof FormState, keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as string;
    handleFieldChange(field, selectedKey || "");
  };

  // Gestion de l'upload de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Suppression d'un fichier
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Sauvegarde manuelle
  const handleSave = async () => {
    const formattedData = formatFormData();
    await saveJustificationHook(formattedData);
    setStatut("BROUILLON");
  };

  // Soumission de la justification
  const handleSubmit = async () => {
    try {
      const formattedData = formatFormData();
      await submitJustification(formattedData);
      setStatut("SOUMISE");

      addToast({
        title: "Justification soumise",
        description: `Justification pour la compétence ${competence.code} du badge ${badge.name} soumise avec succès`,
        variant: "solid",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Erreur de soumission",
        description: "Impossible de soumettre la justification",
        variant: "solid",
        color: "danger",
      });
    }
  };

  // Soumission avec confirmation
  const handleSubmitWithConfirm = async () => {
    const formattedData = formatFormData();
    try {
      await submitJustification({
        ...formattedData,
        id: draft?.id,
      });
      setStatut("SOUMISE");
      addToast({
        title: "Justification soumise",
        description: `Justification pour la compétence ${competence.code} du badge ${badge.name} soumise avec succès`,
        variant: "solid",
        color: "success",
      });
      return true;
    } catch (error) {
      addToast({
        title: "Erreur de soumission",
        description: "Impossible de soumettre la justification",
        variant: "solid",
        color: "danger",
      });
      return false;
    }
  };

  // Initialisation du formulaire avec les données du draft
  const initializeForm = () => {
    if (isOpen) {
      refetch();
    }

    if (draft) {
      setForm({
        activiteDescription: draft.activiteDescription ?? "",
        dateActivite:
          draft.dateActivite && draft.dateActivite !== ""
            ? (() => {
                const date = new Date(draft.dateActivite);
                if (!isNaN(date.getTime())) {
                  return new CalendarDate(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate()
                  );
                }
                return undefined;
              })()
            : undefined,
        dureeHeures: draft.dureeHeures ?? undefined,
        contexte: draft.contexte ?? "",
        nombreJeunes: draft.nombreJeunes ? String(draft.nombreJeunes) : "",
        trancheAge: draft.trancheAge ?? "",
        niveau: draft.niveau ?? "",
        objectifsAtteints: draft.objectifsAtteints ?? "",
      });
      setStatut(draft.statut ?? "BROUILLON");
    } else {
      setForm(initialFormState);
      setStatut("BROUILLON");
    }
    setUploadedFiles([]);
    setActiveTab("justification");
  };

  return {
    // State
    form,
    statut,
    uploadedFiles,
    activeTab,
    draft,
    isLoading,
    isSaving,
    isSubmitting,
    saveError,
    submitError,
    
    // Computed values
    hasFormContent: hasFormContent(),
    
    // Actions
    setActiveTab,
    handleFieldChange,
    handleSelectionChange,
    handleFileUpload,
    removeFile,
    handleSave,
    handleSubmit,
    handleSubmitWithConfirm,
    autoSave,
    initializeForm,
    formatFormData,
  };
}