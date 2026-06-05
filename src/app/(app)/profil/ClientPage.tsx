"use client";

import React from "react";
import { ProfilForm } from "./_components/ProfilForm";
import { Spacer } from "@heroui/react";

export default function ClientPage({ user }: { user: any }) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full pt-4 md:pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
        <p className="text-default-500">
          Consultez et gérez vos informations personnelles.
        </p>
      </div>

      <Spacer y={2} />

      <ProfilForm user={user} />
    </div>
  );
}
