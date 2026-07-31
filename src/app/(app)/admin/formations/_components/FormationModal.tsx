"use client";

import React from "react";
import { Image } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { type FormationCard } from "@prisma/client";

import { createFormation, updateFormation } from "../../_actions/admin.actions";

import { FormModal } from "@/components/admin/FormModal";
import { Input } from "@/components/ui";

const formationSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  imageUrl: z.string().url("URL d'image invalide"),
  lien: z.string().url("Lien invalide"),
});

type FormationFormData = z.infer<typeof formationSchema>;

type FormationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formation?: FormationCard | null;
};

export default function FormationModal({
  isOpen,
  onClose,
  formation,
}: FormationModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormationFormData>({
    resolver: zodResolver(formationSchema),
    defaultValues: { titre: "", imageUrl: "", lien: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        titre: formation?.titre ?? "",
        imageUrl: formation?.imageUrl ?? "",
        lien: formation?.lien ?? "",
      });
    }
  }, [isOpen, formation, reset]);

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: FormationFormData) => {
    setIsPending(true);
    try {
      if (formation) {
        await updateFormation(formation.id, data);
      } else {
        await createFormation(data);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to save formation", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      isPending={isPending}
      submitLabel={formation ? "Mettre à jour" : "Créer"}
      title={formation ? "Modifier la carte" : "Ajouter une carte Formation"}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Titre"
        placeholder="Ex: Apprendre les nœuds"
        {...register("titre")}
        errorMessage={errors.titre?.message}
        isInvalid={!!errors.titre}
      />
      <Input
        label="URL de l'image"
        placeholder="https://..."
        {...register("imageUrl")}
        errorMessage={errors.imageUrl?.message}
        isInvalid={!!errors.imageUrl}
      />
      <Input
        label="Lien (plateforme Flambeaux)"
        placeholder="https://..."
        {...register("lien")}
        errorMessage={errors.lien?.message}
        isInvalid={!!errors.lien}
      />
      {imageUrl ? (
        <div className="flex justify-center pt-2">
          <Image
            alt="Aperçu"
            className="max-h-32 object-cover rounded-large"
            src={imageUrl}
            width={220}
          />
        </div>
      ) : null}
    </FormModal>
  );
}
