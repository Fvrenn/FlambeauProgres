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
import { UserRole, type User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { updateUserRole } from "../../_actions/admin.actions";

const userSchema = z.object({
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: user?.role || UserRole.CHEF,
    },
  });

  React.useEffect(() => {
    if (user) {
      setValue("role", user.role);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    setIsPending(true);
    try {
      await updateUserRole(user.id, data.role);
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
                <Avatar
                  name={user?.name}
                  size="lg"
                  src={user?.image || undefined}
                />
                <div>
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-small text-default-500">{user?.email}</p>
                </div>
              </div>

              <Select
                defaultSelectedKeys={[watch("role")]}
                errorMessage={errors.role?.message}
                isInvalid={!!errors.role}
                label="Rôle"
                placeholder="Sélectionner un rôle"
                onChange={(e) => setValue("role", e.target.value as UserRole)}
              >
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role}>{role}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" isLoading={isPending} type="submit">
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
