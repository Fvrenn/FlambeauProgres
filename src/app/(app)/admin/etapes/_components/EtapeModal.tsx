"use client";

import type { AdminEtapeListItem } from "@/types";

import React from "react";
import {
  Button,
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
import { useRouter } from "next/navigation";
import { TypeObjectif } from "@prisma/client";
import { Icon } from "@iconify/react";

import { createEtape, updateEtape } from "../../_actions/admin.actions";

import { FormModal } from "@/components/admin/FormModal";
import { Input } from "@/components/ui";

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
      texteRequis: z.boolean(),
    }),
  ),
});

type EtapeFormData = z.infer<typeof etapeSchema>;

type EtapeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  etape?: AdminEtapeListItem | null;
};

export default function EtapeModal({
  isOpen,
  onClose,
  etape,
}: EtapeModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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
        setValue("number", etape.number);
        setValue("name", etape.name);
        setValue("description", etape.description);
        setValue("ordre", etape.ordre);
        setValue("objectifs", []);
      } else {
        reset({
          number: "",
          name: "",
          description: "",
          ordre: 1,
          objectifs: [
            {
              code: "",
              description: "",
              type: TypeObjectif.COMPETENCE,
              fichiersRequis: false,
              texteRequis: true,
            },
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
    <FormModal
      isOpen={isOpen}
      isPending={isPending}
      scrollBehavior="inside"
      size="3xl"
      submitLabel={etape ? "Mettre à jour" : "Créer l'étape"}
      title={etape ? "Modifier l'Étape" : "Créer une Étape"}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Tabs fullWidth aria-label="Etape Options">
        <Tab key="infos" title="Informations">
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                className="w-full sm:w-1/4"
                label="Numéro"
                placeholder="Ex: 2b"
                {...register("number")}
                errorMessage={errors.number?.message}
                isInvalid={!!errors.number}
              />
              <Input
                className="w-full sm:w-1/4"
                label="Ordre"
                type="number"
                {...register("ordre", { valueAsNumber: true })}
                errorMessage={errors.ordre?.message}
                isInvalid={!!errors.ordre}
              />
              <Input
                className="w-full sm:w-1/2"
                label="Nom"
                placeholder="Ex: Branche Petits Flambeaux"
                {...register("name")}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Description de l'étape..."
              {...register("description")}
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
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
                  color="secondary"
                  size="sm"
                  startContent={<Icon icon="solar:add-circle-linear" />}
                  variant="flat"
                  onPress={() =>
                    append({
                      code: "",
                      description: "",
                      type: TypeObjectif.COMPETENCE,
                      fichiersRequis: false,
                      texteRequis: true,
                    })
                  }
                >
                  Ajouter
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="border-none bg-default-200 shadow-none"
                  >
                    <CardBody className="p-3 gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2 items-center w-full pr-8">
                          <Input
                            className="w-20"
                            label="Code"
                            placeholder="C1"
                            size="sm"
                            {...register(`objectifs.${index}.code`)}
                            isInvalid={!!errors.objectifs?.[index]?.code}
                          />
                          <Select
                            className="w-32"
                            defaultSelectedKeys={[field.type]}
                            label="Type"
                            size="sm"
                            {...register(`objectifs.${index}.type`)}
                          >
                            <SelectItem key={TypeObjectif.COMPETENCE}>
                              Compétence
                            </SelectItem>
                            <SelectItem key={TypeObjectif.REALISATION}>
                              Réalisation
                            </SelectItem>
                          </Select>
                          <div className="flex items-center">
                            <Switch
                              defaultSelected={field.fichiersRequis}
                              size="sm"
                              {...register(`objectifs.${index}.fichiersRequis`)}
                            >
                              <span className="text-tiny">Fichiers</span>
                            </Switch>
                          </div>
                          <div className="flex items-center">
                            <Switch
                              defaultSelected={field.texteRequis}
                              size="sm"
                              {...register(`objectifs.${index}.texteRequis`)}
                            >
                              <span className="text-tiny">Texte</span>
                            </Switch>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          className="absolute top-2 right-2"
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => remove(index)}
                        >
                          <Icon icon="solar:trash-bin-trash-linear" />
                        </Button>
                      </div>
                      <Textarea
                        label="Description"
                        minRows={1}
                        placeholder="Description de l'objectif..."
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
    </FormModal>
  );
}
