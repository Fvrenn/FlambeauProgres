"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUserRole, updateUserTroupe } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  role: z.nativeEnum(UserRole),
  troupeId: z.string().nullable(),
});

type UserFormData = z.infer<typeof userSchema>;

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Type User from Prisma
  troupes: any[]; // Type Troupe from Prisma
};

export default function UserModal({
  isOpen,
  onClose,
  user,
  troupes,
}: UserModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: user?.role || UserRole.CHEF,
      troupeId: user?.troupeId || null,
    },
  });

  // Update form when user changes
  React.useEffect(() => {
    if (user) {
      setValue("role", user.role);
      setValue("troupeId", user.troupeId);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    setIsPending(true);
    try {
      // Execute both updates
      await Promise.all([
        updateUserRole(user.id, data.role),
        updateUserTroupe(user.id, data.troupeId),
      ]);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to update user", error);
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
              Modifier l'utilisateur
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-4 mb-4">
                <Avatar src={user?.image} name={user?.name} size="lg" />
                <div>
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-small text-default-500">{user?.email}</p>
                </div>
              </div>

              <Select
                label="Rôle"
                placeholder="Sélectionner un rôle"
                defaultSelectedKeys={[watch("role")]}
                onChange={(e) => setValue("role", e.target.value as UserRole)}
              >
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Troupe"
                placeholder="Sélectionner une troupe"
                defaultSelectedKeys={watch("troupeId") ? [watch("troupeId") as string] : []}
                onChange={(e) => setValue("troupeId", e.target.value || null)}
              >
                {troupes.map((troupe) => (
                  <SelectItem key={troupe.id}>
                    {troupe.nom}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
