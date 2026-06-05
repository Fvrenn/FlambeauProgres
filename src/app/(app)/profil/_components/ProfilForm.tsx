"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { addToast } from "@heroui/toast";

export function ProfilForm({ user }: { user: any }) {
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
      
      // Refresh the page or update data to reflect the new state depending on auth architecture
      window.location.reload();
    } catch (err: any) {
      addToast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la mise à jour.",
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
            src={user?.image || undefined}
            name={user?.name || "U"}
            className="w-20 h-20 text-large"
            color="primary"
          />
          <div className="flex flex-col h-full justify-center">
            <h3 className="text-xl font-semibold leading-none mb-2">{user?.name}</h3>
            <p className="text-small text-default-500">{user?.email}</p>
            <p className="text-small text-default-500 capitalize mt-1">
              Rôle : <span className="font-medium text-foreground">{user?.role?.toLowerCase() || "chef"}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input
            label="Nom complet"
            placeholder="Entrez votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
            variant="faded"
            labelPlacement="outside"
            isInvalid={name.trim() === ""}
            errorMessage={name.trim() === "" ? "Le nom est requis" : ""}
          />
          
          <Input
            label="Adresse email"
            defaultValue={user?.email || ""}
            isReadOnly
            variant="faded"
            labelPlacement="outside"
            description="L'adresse email ne peut pas être modifiée."
          />

          <div className="flex justify-end mt-4">
            <Button color="primary" type="submit" isLoading={isLoading}>
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
