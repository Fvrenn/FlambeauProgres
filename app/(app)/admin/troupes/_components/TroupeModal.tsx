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
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTroupe, updateTroupe } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";

const troupeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  chefId: z.string().optional(),
});

type TroupeFormData = z.infer<typeof troupeSchema>;

type TroupeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  troupe?: any; // If provided, edit mode
  users: any[]; // Potential chefs (all users or filtered)
};

export default function TroupeModal({
  isOpen,
  onClose,
  troupe,
  users,
}: TroupeModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TroupeFormData>({
    resolver: zodResolver(troupeSchema),
    defaultValues: {
      nom: "",
      chefId: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (troupe) {
        setValue("nom", troupe.nom);
        // Try to find a member who might be the "chef" or just leave empty
        // For this implementation, we don't pre-fill chef unless we have logic for it.
        // But the prompt implies we can assign a chef.
        setValue("chefId", undefined); 
      } else {
        reset({ nom: "", chefId: undefined });
      }
    }
  }, [isOpen, troupe, setValue, reset]);

  const onSubmit = async (data: TroupeFormData) => {
    setIsPending(true);
    try {
      if (troupe) {
        await updateTroupe(troupe.id, data.nom, data.chefId);
      } else {
        await createTroupe(data.nom, data.chefId);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to save troupe", error);
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

              <Select
                label="Assigner un Chef/Membre"
                placeholder="Sélectionner un utilisateur"
                selectedKeys={watch("chefId") ? [watch("chefId") as string] : []}
                onChange={(e) => setValue("chefId", e.target.value)}
                description="L'utilisateur sélectionné sera ajouté à cette troupe."
              >
                {users.map((user) => (
                  <SelectItem key={user.id} textValue={user.name}>
                    <div className="flex gap-2 items-center">
                        <span className="text-small">{user.name}</span>
                        <span className="text-tiny text-default-400">({user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
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
