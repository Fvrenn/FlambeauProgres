"use client";

import React from "react";
import { Select, SelectItem, Textarea, Switch } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TypeObjectif, type Objectif } from "@prisma/client";

import {
  createObjectif,
  updateObjectif,
} from "../../_actions/objectif.actions";

import { FormModal } from "@/components/admin/FormModal";
import { useSoumissionModal } from "@/components/admin/useSoumissionModal";
import { Input } from "@/components/ui";

const objectifSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.nativeEnum(TypeObjectif),
  fichiersRequis: z.boolean(),
  texteRequis: z.boolean(),
});

type ObjectifFormData = z.infer<typeof objectifSchema>;

const VALEURS_PAR_DEFAUT: ObjectifFormData = {
  code: "",
  description: "",
  type: TypeObjectif.COMPETENCE,
  fichiersRequis: false,
  texteRequis: true,
};

type ObjectifModalProps = {
  isOpen: boolean;
  onClose: () => void;
  objectif?: Objectif | null;
  etapeId: string;
};

export default function ObjectifModal({
  isOpen,
  onClose,
  objectif,
  etapeId,
}: ObjectifModalProps) {
  const { isPending, erreur, setErreur, soumettre } =
    useSoumissionModal(onClose);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ObjectifFormData>({
    resolver: zodResolver(objectifSchema),
    defaultValues: VALEURS_PAR_DEFAUT,
  });

  React.useEffect(() => {
    if (isOpen) {
      setErreur(null);
      reset(
        objectif
          ? {
              code: objectif.code,
              description: objectif.description,
              type: objectif.type,
              fichiersRequis: objectif.fichiersRequis,
              texteRequis: objectif.texteRequis,
            }
          : VALEURS_PAR_DEFAUT,
      );
    }
  }, [isOpen, objectif, reset, setErreur]);

  const onSubmit = (data: ObjectifFormData) => {
    soumettre(() =>
      objectif
        ? updateObjectif(objectif.id, etapeId, data)
        : createObjectif(etapeId, data),
    );
  };

  return (
    <FormModal
      erreur={erreur}
      isOpen={isOpen}
      isPending={isPending}
      submitLabel={objectif ? "Mettre à jour" : "Créer"}
      title={objectif ? "Modifier l'Objectif" : "Créer un Objectif"}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-4">
        <Input
          className="w-1/3"
          label="Code"
          placeholder="Ex: C1"
          {...register("code")}
          errorMessage={errors.code?.message}
          isInvalid={!!errors.code}
        />
        <Select
          className="w-2/3"
          label="Type"
          placeholder="Choisir un type"
          selectedKeys={[watch("type")]}
          onChange={(e) => setValue("type", e.target.value as TypeObjectif)}
        >
          <SelectItem key={TypeObjectif.COMPETENCE}>Compétence</SelectItem>
          <SelectItem key={TypeObjectif.REALISATION}>Réalisation</SelectItem>
        </Select>
      </div>

      <Textarea
        label="Description"
        placeholder="Description de l'objectif..."
        {...register("description")}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
      />

      <div className="flex items-center justify-between py-2">
        <span className="text-small text-default-500">
          Fichiers requis pour valider ?
        </span>
        <Switch
          isSelected={watch("fichiersRequis")}
          onValueChange={(val) => setValue("fichiersRequis", val)}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-small text-default-500">
          Texte obligatoire pour valider ?
        </span>
        <Switch
          isSelected={watch("texteRequis")}
          onValueChange={(val) => setValue("texteRequis", val)}
        />
      </div>
    </FormModal>
  );
}
