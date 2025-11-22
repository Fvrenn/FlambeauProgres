"use client";

import React from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Button, Chip, Tooltip, Breadcrumbs, BreadcrumbItem, Image, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import ObjectifModal from "../_components/ObjectifModal";
import { updateEtapeBadge, deleteObjectif } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";

type EtapeDetailClientPageProps = {
  etape: any;
};

const columns: Column[] = [
  { key: "code", label: "CODE", sortable: true },
  { key: "description", label: "DESCRIPTION", sortable: true },
  { key: "type", label: "TYPE", sortable: true },
  { key: "fichiers", label: "FICHIERS" },
  { key: "actions", label: "ACTIONS" },
];

export default function EtapeDetailClientPage({ etape }: EtapeDetailClientPageProps) {
  const router = useRouter();
  const [selectedObjectif, setSelectedObjectif] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [badgeUrl, setBadgeUrl] = React.useState(etape.image_src || "");
  const [isSavingBadge, setIsSavingBadge] = React.useState(false);

  const handleEdit = (objectif: any) => {
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
  }

  const renderCell = React.useCallback((objectif: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "code":
        return <span className="font-bold">{objectif.code}</span>;
      case "description":
        return <span className="text-small">{objectif.description}</span>;
      case "type":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={objectif.type === "COMPETENCE" ? "primary" : "success"}
          >
            {objectif.type}
          </Chip>
        );
      case "fichiers":
          return objectif.fichiersRequis ? (
              <Icon icon="solar:file-check-linear" className="text-success text-lg" />
          ) : (
              <span className="text-default-300">-</span>
          );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEdit(objectif)}
              >
                <Icon icon="solar:pen-linear" />
              </span>
            </Tooltip>
            <Tooltip content="Supprimer" color="danger">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDelete(objectif.id)}
              >
                <Icon icon="solar:trash-bin-trash-linear" />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, [etape.id, router]); // Added dependencies

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/etapes">Étapes</BreadcrumbItem>
        <BreadcrumbItem>{etape.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Badge Management Panel */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 p-4 border-small border-divider rounded-large bg-content1 shadow-small">
            <h2 className="text-lg font-bold">Badge de l'étape</h2>
            <div className="flex justify-center py-4">
                <div className="w-32 h-32 rounded-xl bg-default-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-default-300">
                    {badgeUrl ? (
                        <Image src={badgeUrl} alt="Badge" width={128} height={128} className="object-cover" />
                    ) : (
                        <Icon icon="solar:gallery-add-linear" className="text-4xl text-default-400" />
                    )}
                </div>
            </div>
            <Input 
                label="URL de l'image" 
                placeholder="https://..." 
                value={badgeUrl} 
                onValueChange={setBadgeUrl}
                size="sm"
            />
            <Button color="primary" isLoading={isSavingBadge} onPress={handleSaveBadge}>
                Enregistrer le badge
            </Button>
          </div>

          {/* Objectifs Management Panel */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Objectifs ({etape.objectifs.length})</h2>
                <Button color="primary" size="sm" startContent={<Icon icon="solar:add-circle-linear" />} onPress={handleCreate}>
                    Ajouter un objectif
                </Button>
            </div>
            
            <AdminDataTable
                columns={columns}
                data={etape.objectifs}
                renderCell={renderCell}
                searchPlaceholder="Rechercher un objectif..."
                initialRowsPerPage={5}
            />
          </div>
      </div>

      <ObjectifModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        objectif={selectedObjectif}
        etapeId={etape.id}
      />
    </div>
  );
}
