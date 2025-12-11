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
  Tabs,
  Tab,
  Card,
  CardBody,
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
              <Tabs aria-label="Etape Options" fullWidth>
                <Tab key="infos" title="Informations">
                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        label="Numéro"
                        placeholder="Ex: 2b"
                        className="w-full sm:w-1/4"
                        {...register("number")}
                        isInvalid={!!errors.number}
                        errorMessage={errors.number?.message}
                      />
                      <Input
                        label="Ordre"
                        type="number"
                        className="w-full sm:w-1/4"
                        {...register("ordre", { valueAsNumber: true })}
                        isInvalid={!!errors.ordre}
                        errorMessage={errors.ordre?.message}
                      />
                      <Input
                        label="Nom"
                        placeholder="Ex: Branche Petits Flambeaux"
                        className="w-full sm:w-1/2"
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
                  </div>
                </Tab>

                {!etape && (
                  <Tab key="objectifs" title={`Objectifs (${fields.length})`}>
                    <div className="flex flex-col gap-4 py-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-small text-default-500">
                          Définissez les objectifs initiaux pour cette étape.
                        </span>
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
                          Ajouter
                        </Button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {fields.map((field, index) => (
                          <Card key={field.id} className="border-none bg-default-200 shadow-none">
                            <CardBody className="p-3 gap-3">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-wrap gap-2 items-center w-full pr-8">
                                  <Input
                                    label="Code"
                                    placeholder="C1"
                                    size="sm"
                                    className="w-20"
                                    {...register(`objectifs.${index}.code`)}
                                    isInvalid={!!errors.objectifs?.[index]?.code}
                                  />
                                  <Select
                                    label="Type"
                                    size="sm"
                                    className="w-32"
                                    defaultSelectedKeys={[field.type]}
                                    {...register(`objectifs.${index}.type`)}
                                  >
                                    <SelectItem key={TypeObjectif.COMPETENCE}>Compétence</SelectItem>
                                    <SelectItem key={TypeObjectif.REALISATION}>Réalisation</SelectItem>
                                  </Select>
                                  <div className="flex items-center">
                                    <Switch
                                      size="sm"
                                      defaultSelected={field.fichiersRequis}
                                      {...register(`objectifs.${index}.fichiersRequis`)}
                                    >
                                      <span className="text-tiny">Fichiers</span>
                                    </Switch>
                                  </div>
                                </div>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onPress={() => remove(index)}
                                >
                                  <Icon icon="solar:trash-bin-trash-linear" />
                                </Button>
                              </div>
                              <Textarea
                                label="Description"
                                placeholder="Description de l'objectif..."
                                minRows={1}
                                size="sm"
                                {...register(`objectifs.${index}.description`)}
                                isInvalid={!!errors.objectifs?.[index]?.description}
                              />
                            </CardBody>
                          </Card>
                        ))}
                        {fields.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-default-400 gap-2 border border-dashed border-default-200 rounded-medium">
                            <Icon icon="solar:target-linear" width={32} />
                            <p className="text-small">Aucun objectif ajouté</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                )}
              </Tabs>
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
