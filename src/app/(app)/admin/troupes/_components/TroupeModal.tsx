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
  User,
  Tooltip,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTroupe, updateTroupe, updateUserTroupe } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

const troupeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
});

type TroupeFormData = z.infer<typeof troupeSchema>;

type TroupeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  troupe?: any; // If provided, edit mode
  users?: any[]; // Keep for compatibility if passed, but unused for dropdown now
};

export default function TroupeModal({
  isOpen,
  onClose,
  troupe,
}: TroupeModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TroupeFormData>({
    resolver: zodResolver(troupeSchema),
    defaultValues: {
      nom: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (troupe) {
        setValue("nom", troupe.nom);
      } else {
        reset({ nom: "" });
      }
    }
  }, [isOpen, troupe, setValue, reset]);

  const onSubmit = async (data: TroupeFormData) => {
    setIsPending(true);
    try {
      if (troupe) {
        await updateTroupe(troupe.id, data.nom);
      } else {
        await createTroupe(data.nom);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to save troupe", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Voulez-vous vraiment retirer ce membre de la troupe ?")) return;

    try {
      await updateUserTroupe(memberId, null);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {troupe ? "Modifier la Troupe" : "Créer une Troupe"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nom de la troupe"
                placeholder="Ex: Troupe du Phénix"
                {...register("nom")}
                isInvalid={!!errors.nom}
                errorMessage={errors.nom?.message}
              />

              {troupe && troupe.membres && troupe.membres.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  <span className="text-small font-bold">Membres ({troupe.membres.length})</span>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {troupe.membres.map((member: any) => (
                      <div key={member.id} className="flex justify-between items-center bg-default-100 p-2 rounded-lg">
                        <User
                          name={member.name}
                          description={member.email}
                          avatarProps={{
                            src: member.image
                          }}
                        />
                        <Tooltip content="Retirer de la troupe" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => handleRemoveMember(member.id)}
                          >
                            <Icon icon="solar:trash-bin-trash-linear" width={20} />
                          </Button>
                        </Tooltip>
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
                {troupe ? "Mettre à jour" : "Créer"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
