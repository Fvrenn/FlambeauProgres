"use client";

import type { UserResume } from "@/types";

import React from "react";
import { Select, SelectItem } from "@heroui/react";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { updateUserRole } from "../../_actions/user.actions";

import { FormModal } from "@/components/admin/FormModal";
import { useSoumissionModal } from "@/components/admin/useSoumissionModal";
import { roleLabelMap } from "@/lib/roles";
import { Avatar } from "@/components/ui";

const userSchema = z.object({
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserResume;
};

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { isPending, erreur, setErreur, soumettre } =
    useSoumissionModal(onClose);

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
      setErreur(null);
      setValue("role", user.role);
    }
  }, [user, setValue, setErreur]);

  const onSubmit = (data: UserFormData) => {
    soumettre(() => updateUserRole(user.id, data.role));
  };

  return (
    <FormModal
      erreur={erreur}
      isOpen={isOpen}
      isPending={isPending}
      submitLabel="Enregistrer"
      title="Modifier l'utilisateur"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar name={user?.name} size="lg" src={user?.image || undefined} />
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
          <SelectItem key={role}>{roleLabelMap[role]}</SelectItem>
        ))}
      </Select>
    </FormModal>
  );
}
