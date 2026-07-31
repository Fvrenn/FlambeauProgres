"use client";

import type { AdminEtapeListItem } from "@/types";

import React from "react";
import { Image, Button as HeroButton, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import EtapeModal from "./_components/EtapeModal";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Button, Card, CardBody } from "@/components/ui";

type EtapesClientPageProps = {
  etapes: AdminEtapeListItem[];
};

const columns: Column[] = [
  { key: "badge", label: "BADGE", sortable: false },
  { key: "name", label: "NOM", sortable: true },
  { key: "objectifs", label: "OBJECTIFS", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export default function EtapesClientPage({ etapes }: EtapesClientPageProps) {
  const [selectedEtape, setSelectedEtape] =
    React.useState<AdminEtapeListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = () => {
    setSelectedEtape(null);
    setIsModalOpen(true);
  };

  const handleEditInfo = (etape: AdminEtapeListItem) => {
    setSelectedEtape(etape);
    setIsModalOpen(true);
  };

  const renderCell = React.useCallback(
    (etape: AdminEtapeListItem, columnKey: React.Key) => {
      switch (columnKey) {
        case "badge":
          return (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
              {etape.image_src ? (
                <Image
                  alt={etape.name}
                  height={48}
                  src={etape.image_src}
                  width={48}
                />
              ) : (
                <span className="text-lg font-bold text-default-400">
                  {etape.number}
                </span>
              )}
            </div>
          );
        case "name":
          return (
            <div className="flex flex-col">
              <p className="font-bold">{etape.name}</p>
              <p className="text-tiny text-default-400 line-clamp-1">
                {etape.description}
              </p>
            </div>
          );
        case "objectifs":
          return (
            <div className="flex items-center gap-2">
              <Icon className="text-default-400" icon="solar:target-linear" />
              <span>{etape._count.objectifs} objectif(s)</span>
            </div>
          );
        case "actions":
          return (
            <div className="flex items-center justify-end w-full pr-8 gap-2">
              <Tooltip content="Modifier les infos">
                <Button
                  isIconOnly
                  color="default"
                  size="sm"
                  startIcon="solar:pen-linear"
                  variant="ghost"
                  onClick={() => handleEditInfo(etape)}
                />
              </Tooltip>
              <Tooltip content="Gérer les objectifs">
                <HeroButton
                  isIconOnly
                  as={Link}
                  href={`/admin/etapes/${etape.id}`}
                  size="sm"
                  variant="light"
                >
                  <Icon
                    className="text-lg text-default-400"
                    icon="solar:settings-linear"
                  />
                </HeroButton>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Gestion des Étapes</h1>
        <Button
          color="primary"
          endIcon="solar:add-circle-linear"
          onClick={handleCreate}
        >
          Nouvelle Étape
        </Button>
      </div>

      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={etapes}
          renderCell={renderCell}
          searchPlaceholder="Rechercher une étape..."
        />
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {etapes.map((etape) => (
          <Card
            key={etape.id}
            isPressable
            className="w-full"
            onClick={() => handleEditInfo(etape)}
          >
            <CardBody className="flex-row gap-4 items-start">
              <div className="flex-none">
                <div className="w-12 h-12 rounded-lg bg-content1 flex items-center justify-center overflow-hidden">
                  {etape.image_src ? (
                    <Image
                      alt={etape.name}
                      className="object-cover"
                      height={48}
                      src={etape.image_src}
                      width={48}
                    />
                  ) : (
                    <span className="text-lg font-bold text-default-400">
                      {etape.number}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-grow flex flex-col gap-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-medium font-semibold truncate">
                    {etape.name}
                  </span>
                  <div className="text-default-400">
                    <Icon icon="solar:pen-linear" width={20} />
                  </div>
                </div>
                <p className="text-tiny text-default-400 line-clamp-2">
                  {etape.description}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-tiny text-default-500">
                    <Icon icon="solar:target-linear" width={14} />
                    <span>{etape._count?.objectifs || 0} obj.</span>
                  </div>

                  <HeroButton
                    as={Link}
                    className="h-8"
                    color="primary"
                    endContent={<Icon icon="solar:settings-linear" />}
                    href={`/admin/etapes/${etape.id}`}
                    size="sm"
                    variant="flat"
                  >
                    Gérer
                  </HeroButton>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <EtapeModal
        etape={selectedEtape}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
