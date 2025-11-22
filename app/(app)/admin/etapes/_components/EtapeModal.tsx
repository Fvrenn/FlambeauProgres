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
  Textarea,
  Select,
  SelectItem,
  Switch,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createEtape, updateEtape } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";
import { TypeObjectif } from "@prisma/client";
import { Icon } from "@iconify/react";

const etapeSchema = z.object({
  number: z.string().min(1, "Le numéro est requis"),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  ordre: z.number().min(1, "L'ordre doit être positif"),
  objectifs: z.array(
    z.object({
      code: z.string().min(1, "Code requis"),
      description: z.string().min(1, "Description requise"),
      type: z.nativeEnum(TypeObjectif),
      fichiersRequis: z.boolean(),
    })
  ),
});

type EtapeFormData = z.infer<typeof etapeSchema>;

type EtapeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  etape?: any; // If provided, edit mode (but objectives are managed separately in edit mode)
};

export default function EtapeModal({ isOpen, onClose, etape }: EtapeModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EtapeFormData>({
    resolver: zodResolver(etapeSchema),
    defaultValues: {
      number: "",
      name: "",
      description: "",
      ordre: 1,
      objectifs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectifs",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (etape) {
        // In edit mode, we only edit the main etape info
        setValue("number", etape.number);
        setValue("name", etape.name);
        setValue("description", etape.description);
        setValue("ordre", etape.ordre);
        // We don't load objectives here because they are managed in the detail view
        setValue("objectifs", []); 
      } else {
        reset({
          number: "",
          name: "",
          description: "",
          ordre: 1,
          objectifs: [
              // Add one default objective to start with
              { code: "", description: "", type: TypeObjectif.COMPETENCE, fichiersRequis: false }
          ],
        });
      }
    }
  }, [isOpen, etape, setValue, reset]);

  const onSubmit = async (data: EtapeFormData) => {
    setIsPending(true);
    try {
      if (etape) {
        await updateEtape(etape.id, {
            number: data.number,
            name: data.name,
            description: data.description,
            ordre: data.ordre,
        });
      } else {
        await createEtape(data);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to save etape", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {etape ? "Modifier l'Étape" : "Créer une Étape"}
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-4">
                <Input
                  label="Numéro"
                  placeholder="Ex: 2b"
                  className="w-1/4"
                  {...register("number")}
                  isInvalid={!!errors.number}
                  errorMessage={errors.number?.message}
                />
                 <Input
                  label="Ordre"
                  type="number"
                  className="w-1/4"
                  {...register("ordre", { valueAsNumber: true })}
                  isInvalid={!!errors.ordre}
                  errorMessage={errors.ordre?.message}
                />
                <Input
                  label="Nom"
                  placeholder="Ex: Branche Petits Flambeaux"
                  className="w-1/2"
                  {...register("name")}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Description de l'étape..."
                {...register("description")}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
              />

              {!etape && (
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Objectifs initiaux</h3>
                    <Button
                      size="sm"
                      color="secondary"
                      variant="flat"
                      startContent={<Icon icon="solar:add-circle-linear" />}
                      onPress={() =>
                        append({
                          code: "",
                          description: "",
                          type: TypeObjectif.COMPETENCE,
                          fichiersRequis: false,
                        })
                      }
                    >
                      Ajouter un objectif
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start p-4 border border-divider rounded-lg bg-default-50">
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex gap-2">
                                <Input
                                    label="Code"
                                    placeholder="C1"
                                    className="w-1/4"
                                    {...register(`objectifs.${index}.code`)}
                                    isInvalid={!!errors.objectifs?.[index]?.code}
                                />
                                <Select
                                    label="Type"
                                    className="w-1/4"
                                    defaultSelectedKeys={[field.type]}
                                    {...register(`objectifs.${index}.type`)}
                                >
                                    <SelectItem key={TypeObjectif.COMPETENCE}>Compétence</SelectItem>
                                    <SelectItem key={TypeObjectif.REALISATION}>Réalisation</SelectItem>
                                </Select>
                                <div className="flex items-center gap-2 w-1/4 justify-center">
                                    <span className="text-tiny">Fichiers ?</span>
                                    <Switch 
                                        defaultSelected={field.fichiersRequis}
                                        {...register(`objectifs.${index}.fichiersRequis`)}
                                    />
                                </div>
                            </div>
                            <Textarea
                                label="Description"
                                placeholder="Description..."
                                minRows={1}
                                {...register(`objectifs.${index}.description`)}
                                isInvalid={!!errors.objectifs?.[index]?.description}
                            />
                        </div>
                        <Button isIconOnly color="danger" variant="light" onPress={() => remove(index)}>
                            <Icon icon="solar:trash-bin-trash-linear" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                {etape ? "Mettre à jour" : "Créer l'étape"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
