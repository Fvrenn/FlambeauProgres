"use client";

import type { FormationCard } from "@prisma/client";

import React from "react";
import { Button, Tooltip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import FormationModal from "./_components/FormationModal";

import { deleteFormation } from "../_actions/admin.actions";

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
          endContent={<Icon icon="solar:add-circle-linear" />}
          onPress={handleCreate}
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
            <div
              key={formation.id}
              className="flex flex-col rounded-large border border-divider bg-content1 overflow-hidden shadow-small"
            >
              <div className="aspect-video w-full bg-default-100 overflow-hidden">
                <Image
                  removeWrapper
                  alt={formation.titre}
                  className="w-full h-full object-cover"
                  src={formation.imageUrl}
                />
              </div>
              <div className="flex flex-col gap-2 p-3">
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
                    <button
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      type="button"
                      onClick={() => handleEdit(formation)}
                    >
                      <Icon icon="solar:pen-linear" />
                    </button>
                  </Tooltip>
                  <Tooltip color="danger" content="Supprimer">
                    <button
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      type="button"
                      onClick={() => handleDelete(formation.id)}
                    >
                      <Icon icon="solar:trash-bin-trash-linear" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
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
