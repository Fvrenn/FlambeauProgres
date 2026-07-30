"use client";

import type { getUser } from "@/lib/auth-server";
import type { UserRole } from "@prisma/client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, Avatar } from "@heroui/react";
import { addToast } from "@heroui/toast";

import { authClient } from "@/lib/auth-client";

type ProfilUser = NonNullable<Awaited<ReturnType<typeof getUser>>> & {
  role?: UserRole;
};

export function ProfilForm({ user }: { user: ProfilUser }) {
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        throw new Error(error.message);
      }

      addToast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
        color: "success",
      });

      window.location.reload();
    } catch (err) {
      addToast({
        title: "Erreur",
        description:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la mise à jour.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-small border-1 border-divider">
      <CardBody className="p-6 gap-6">
        <div className="flex items-center gap-6">
          <Avatar
            className="w-20 h-20 text-large"
            color="primary"
            name={user?.name || "U"}
            src={user?.image || undefined}
          />
          <div className="flex flex-col h-full justify-center">
            <h3 className="text-xl font-semibold leading-none mb-2">
              {user?.name}
            </h3>
            <p className="text-small text-default-500">{user?.email}</p>
            <p className="text-small text-default-500 capitalize mt-1">
              Rôle :{" "}
              <span className="font-medium text-foreground">
                {user?.role?.toLowerCase() || "chef"}
              </span>
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            errorMessage={name.trim() === "" ? "Le nom est requis" : ""}
            isInvalid={name.trim() === ""}
            label="Nom complet"
            labelPlacement="outside"
            placeholder="Entrez votre nom"
            value={name}
            variant="faded"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            isReadOnly
            defaultValue={user?.email || ""}
            description="L'adresse email ne peut pas être modifiée."
            label="Adresse email"
            labelPlacement="outside"
            variant="faded"
          />

          <div className="flex justify-end mt-4">
            <Button color="primary" isLoading={isLoading} type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
