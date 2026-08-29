"use client";

import type { Objectif } from "@prisma/client";
import type { AdminEtapeWithObjectifs } from "@/types";

import React from "react";
import {
  Chip,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
  Image,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import ObjectifModal from "../_components/ObjectifModal";
import { updateEtapeBadge, deleteObjectif } from "../../_actions/admin.actions";

import { Icon } from "@/lib/icons";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Input } from "@/components/ui";
import { DEFAULT_ETAPE_COLOR } from "@/lib/color";

type EtapeDetailClientPageProps = {
  etape: AdminEtapeWithObjectifs;
};

const columns: Column[] = [
  { key: "code", label: "CODE", sortable: true },
  { key: "description", label: "DESCRIPTION", sortable: true },
  { key: "type", label: "TYPE", sortable: true },
  { key: "fichiers", label: "FICHIERS" },
  { key: "texte", label: "TEXTE" },
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
  const [couleur, setCouleur] = React.useState(
    etape.couleur || DEFAULT_ETAPE_COLOR,
  );
  const [isSavingBadge, setIsSavingBadge] = React.useState(false);

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

  const handleSaveBadge = async () => {
    setIsSavingBadge(true);
    try {
      await updateEtapeBadge(etape.id, badgeUrl, couleur);
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
        case "texte":
          return objectif.texteRequis ? (
            <Icon
              className="text-success text-lg"
              icon="solar:document-text-linear"
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
        <div className="w-full md:w-1/3 flex flex-col gap-4 p-6 rounded-[22px] bg-[#FAF6EB]">
          <h2 className="text-[15px] font-bold">Badge de l'étape</h2>
          <div className="flex justify-center py-4">
            <div className="w-32 h-32 rounded-xl bg-dashboard-border/50 flex items-center justify-center overflow-hidden border-2 border-dashed border-dashboard-border">
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
                  className="text-4xl text-foreground/30"
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
          <div className="flex items-end gap-2">
            <input
              aria-label="Couleur de l'étape"
              className="h-10 w-12 shrink-0 cursor-pointer rounded-medium border border-dashboard-border bg-transparent p-1"
              type="color"
              value={couleur}
              onChange={(e) => setCouleur(e.target.value)}
            />
            <Input
              description="Couleur du curseur des onglets côté chef"
              label="Couleur des onglets"
              placeholder={DEFAULT_ETAPE_COLOR}
              size="sm"
              value={couleur}
              onValueChange={setCouleur}
            />
          </div>
          <button
            className="w-full rounded-[12px] py-2 text-[13px] font-semibold text-white cursor-pointer transition-colors"
            disabled={isSavingBadge}
            style={{ backgroundColor: isSavingBadge ? "#4d634f" : "#2f4a35" }}
            onClick={handleSaveBadge}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4d634f")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2f4a35")
            }
          >
            {isSavingBadge ? "Enregistrement..." : "Enregistrer le badge"}
          </button>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Objectifs ({etape.objectifs.length})
            </h2>
            <button
              className="flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-[13px] font-semibold text-white cursor-pointer transition-colors"
              style={{ backgroundColor: "#2f4a35" }}
              onClick={handleCreate}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4d634f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2f4a35")
              }
            >
              <Icon icon="solar:add-circle-linear" width={16} />
              Ajouter un objectif
            </button>
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

      <ObjectifModal
        etapeId={etape.id}
        isOpen={isModalOpen}
        objectif={selectedObjectif}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
