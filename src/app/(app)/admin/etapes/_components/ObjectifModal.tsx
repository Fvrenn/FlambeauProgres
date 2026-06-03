"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TypeObjectif, type Objectif } from "@prisma/client";

import { createObjectif, updateObjectif } from "../../_actions/admin.actions";

const objectifSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.nativeEnum(TypeObjectif),
  fichiersRequis: z.boolean(),
});

type ObjectifFormData = z.infer<typeof objectifSchema>;

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
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ObjectifFormData>({
    resolver: zodResolver(objectifSchema),
    defaultValues: {
      code: "",
      description: "",
      type: TypeObjectif.COMPETENCE,
      fichiersRequis: false,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (objectif) {
        setValue("code", objectif.code);
        setValue("description", objectif.description);
        setValue("type", objectif.type);
        setValue("fichiersRequis", objectif.fichiersRequis);
      } else {
        reset({
          code: "",
          description: "",
          type: TypeObjectif.COMPETENCE,
          fichiersRequis: false,
        });
      }
    }
  }, [isOpen, objectif, setValue, reset]);

  const onSubmit = async (data: ObjectifFormData) => {
    setIsPending(true);
    try {
      if (objectif) {
        await updateObjectif(objectif.id, etapeId, data);
      } else {
        await createObjectif(etapeId, data);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to save objectif", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {objectif ? "Modifier l'Objectif" : "Créer un Objectif"}
            </ModalHeader>
            <ModalBody>
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
                  onChange={(e) =>
                    setValue("type", e.target.value as TypeObjectif)
                  }
                >
                  <SelectItem key={TypeObjectif.COMPETENCE}>
                    Compétence
                  </SelectItem>
                  <SelectItem key={TypeObjectif.REALISATION}>
                    Réalisation
                  </SelectItem>
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" isLoading={isPending} type="submit">
                {objectif ? "Mettre à jour" : "Créer"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
