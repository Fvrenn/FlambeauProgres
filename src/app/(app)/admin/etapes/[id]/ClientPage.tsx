"use client";

import type { Objectif, FormationCard } from "@prisma/client";
import type { AdminEtapeDetail } from "@/types";

import React from "react";
import {
  Button,
  Chip,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
  Image,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import ObjectifModal from "../_components/ObjectifModal";
import FormationModal from "../_components/FormationModal";
import {
  updateEtapeBadge,
  deleteObjectif,
  deleteFormation,
} from "../../_actions/admin.actions";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";

type EtapeDetailClientPageProps = {
  etape: AdminEtapeDetail;
};

const columns: Column[] = [
  { key: "code", label: "CODE", sortable: true },
  { key: "description", label: "DESCRIPTION", sortable: true },
  { key: "type", label: "TYPE", sortable: true },
  { key: "fichiers", label: "FICHIERS" },
  { key: "actions", label: "ACTIONS" },
];

export default function EtapeDetailClientPage({
  etape,
}: EtapeDetailClientPageProps) {
  const router = useRouter();
  const [selectedObjectif, setSelectedObjectif] =
    React.useState<Objectif | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [badgeUrl, setBadgeUrl] = React.useState(etape.image_src || "");
  const [isSavingBadge, setIsSavingBadge] = React.useState(false);
  const [selectedFormation, setSelectedFormation] =
    React.useState<FormationCard | null>(null);
  const [isFormationModalOpen, setIsFormationModalOpen] = React.useState(false);

  const handleEdit = (objectif: Objectif) => {
    setSelectedObjectif(objectif);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedObjectif(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (objectifId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      await deleteObjectif(objectifId, etape.id);
      router.refresh();
    }
  };

  const handleEditFormation = (formation: FormationCard) => {
    setSelectedFormation(formation);
    setIsFormationModalOpen(true);
  };

  const handleCreateFormation = () => {
    setSelectedFormation(null);
    setIsFormationModalOpen(true);
  };

  const handleDeleteFormation = async (formationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      await deleteFormation(formationId, etape.id);
      router.refresh();
    }
  };

  const handleSaveBadge = async () => {
    setIsSavingBadge(true);
    try {
      await updateEtapeBadge(etape.id, badgeUrl);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingBadge(false);
    }
  };

  const renderCell = React.useCallback(
    (objectif: Objectif, columnKey: React.Key) => {
      switch (columnKey) {
        case "code":
          return <span className="font-bold">{objectif.code}</span>;
        case "description":
          return <span className="text-small">{objectif.description}</span>;
        case "type":
          return (
            <Chip
              color={objectif.type === "COMPETENCE" ? "primary" : "success"}
              size="sm"
              variant="flat"
            >
              {objectif.type}
            </Chip>
          );
        case "fichiers":
          return objectif.fichiersRequis ? (
            <Icon
              className="text-success text-lg"
              icon="solar:file-check-linear"
            />
          ) : (
            <span className="text-default-300">-</span>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Modifier">
                <button
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  type="button"
                  onClick={() => handleEdit(objectif)}
                >
                  <Icon icon="solar:pen-linear" />
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Supprimer">
                <button
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  type="button"
                  onClick={() => handleDelete(objectif.id)}
                >
                  <Icon icon="solar:trash-bin-trash-linear" />
                </button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [etape.id, router],
  );

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/etapes">Étapes</BreadcrumbItem>
        <BreadcrumbItem>{etape.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 flex flex-col gap-4 p-4 border-small border-divider rounded-large bg-content1 shadow-small">
          <h2 className="text-lg font-bold">Badge de l'étape</h2>
          <div className="flex justify-center py-4">
            <div className="w-32 h-32 rounded-xl bg-default-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-default-300">
              {badgeUrl ? (
                <Image
                  alt="Badge"
                  className="object-cover"
                  height={128}
                  src={badgeUrl}
                  width={128}
                />
              ) : (
                <Icon
                  className="text-4xl text-default-400"
                  icon="solar:gallery-add-linear"
                />
              )}
            </div>
          </div>
          <Input
            label="URL de l'image"
            placeholder="https://..."
            size="sm"
            value={badgeUrl}
            onValueChange={setBadgeUrl}
          />
          <Button
            color="primary"
            isLoading={isSavingBadge}
            onPress={handleSaveBadge}
          >
            Enregistrer le badge
          </Button>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Objectifs ({etape.objectifs.length})
            </h2>
            <Button
              color="primary"
              size="sm"
              startContent={<Icon icon="solar:add-circle-linear" />}
              onPress={handleCreate}
            >
              Ajouter un objectif
            </Button>
          </div>

          <AdminDataTable
            columns={columns}
            data={etape.objectifs}
            initialRowsPerPage={5}
            renderCell={renderCell}
            searchPlaceholder="Rechercher un objectif..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Cartes Formation ({etape.formations.length})
          </h2>
          <Button
            color="primary"
            size="sm"
            startContent={<Icon icon="solar:add-circle-linear" />}
            onPress={handleCreateFormation}
          >
            Ajouter une carte
          </Button>
        </div>

        {etape.formations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-default-400 border border-dashed border-default-300 rounded-large">
            <Icon className="text-3xl" icon="solar:gallery-add-linear" />
            <p className="text-sm">Aucune carte de formation pour cette étape.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {etape.formations.map((formation) => (
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
                        onClick={() => handleEditFormation(formation)}
                      >
                        <Icon icon="solar:pen-linear" />
                      </button>
                    </Tooltip>
                    <Tooltip color="danger" content="Supprimer">
                      <button
                        className="text-lg text-danger cursor-pointer active:opacity-50"
                        type="button"
                        onClick={() => handleDeleteFormation(formation.id)}
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
      </div>

      <ObjectifModal
        etapeId={etape.id}
        isOpen={isModalOpen}
        objectif={selectedObjectif}
        onClose={() => setIsModalOpen(false)}
      />

      <FormationModal
        etapeId={etape.id}
        formation={selectedFormation}
        isOpen={isFormationModalOpen}
        onClose={() => setIsFormationModalOpen(false)}
      />
    </div>
  );
}
