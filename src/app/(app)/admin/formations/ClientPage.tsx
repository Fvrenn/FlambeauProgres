"use client";

import type { FormationCard } from "@prisma/client";

import React from "react";
import { Tooltip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { deleteFormation } from "../_actions/admin.actions";

import FormationModal from "./_components/FormationModal";

import { Button, Card, CardBody } from "@/components/ui";

type FormationsClientPageProps = {
  formations: FormationCard[];
};

export default function FormationsClientPage({
  formations,
}: FormationsClientPageProps) {
  const router = useRouter();
  const [selectedFormation, setSelectedFormation] =
    React.useState<FormationCard | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = () => {
    setSelectedFormation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (formation: FormationCard) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };

  const handleDelete = async (formationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      await deleteFormation(formationId);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion de la Formation</h1>
        <Button
          color="primary"
          endIcon="solar:add-circle-linear"
          onClick={handleCreate}
        >
          Ajouter une carte
        </Button>
      </div>

      {formations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-default-400 border border-dashed border-default-300 rounded-large">
          <Icon className="text-3xl" icon="solar:gallery-add-linear" />
          <p className="text-sm">Aucune carte de formation pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formations.map((formation) => (
            <Card key={formation.id} className="p-0" size="sm">
              <div className="aspect-video w-full bg-content1 overflow-hidden rounded-t-ds-lg">
                <Image
                  removeWrapper
                  alt={formation.titre}
                  className="w-full h-full object-cover"
                  src={formation.imageUrl}
                />
              </div>
              <CardBody className="gap-2 p-3">
                <p className="font-semibold line-clamp-1">{formation.titre}</p>
                <a
                  className="text-tiny text-primary truncate hover:underline"
                  href={formation.lien}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {formation.lien}
                </a>
                <div className="flex justify-end gap-1 pt-1">
                  <Tooltip content="Modifier">
                    <Button
                      isIconOnly
                      color="default"
                      size="sm"
                      startIcon="solar:pen-linear"
                      variant="ghost"
                      onClick={() => handleEdit(formation)}
                    />
                  </Tooltip>
                  <Tooltip color="danger" content="Supprimer">
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      startIcon="solar:trash-bin-trash-linear"
                      variant="ghost"
                      onClick={() => handleDelete(formation.id)}
                    />
                  </Tooltip>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <FormationModal
        formation={selectedFormation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
