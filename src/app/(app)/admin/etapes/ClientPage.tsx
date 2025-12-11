"use client";

import React from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Image, Button, Tooltip, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import EtapeModal from "./_components/EtapeModal";

type EtapesClientPageProps = {
  etapes: any[];
};

const columns: Column[] = [
  { key: "badge", label: "BADGE", sortable: false },
  { key: "name", label: "NOM", sortable: true },
  { key: "objectifs", label: "OBJECTIFS", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export default function EtapesClientPage({ etapes }: EtapesClientPageProps) {
  const [selectedEtape, setSelectedEtape] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = () => {
    setSelectedEtape(null);
    setIsModalOpen(true);
  };

  const handleEditInfo = (etape: any) => {
    setSelectedEtape(etape);
    setIsModalOpen(true);
  }

  const renderCell = React.useCallback((etape: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "badge":
        return (
          <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center overflow-hidden">
            {etape.image_src ? (
              <Image
                src={etape.image_src}
                alt={etape.name}
                width={48}
                height={48}
                className="object-cover"
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
            <p className="text-tiny text-default-400 line-clamp-1">{etape.description}</p>
          </div>
        );
      case "objectifs":
        return (
          <div className="flex items-center gap-2">
            <Icon icon="solar:target-linear" className="text-default-400" />
            <span>{etape._count.objectifs} objectif(s)</span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end w-full pr-8 gap-2">
            <Tooltip content="Modifier les infos">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditInfo(etape)}
              >
                <Icon icon="solar:pen-linear" />
              </span>
            </Tooltip>
            <Tooltip content="Gérer les objectifs">
              <Button
                as={Link}
                href={`/admin/etapes/${etape.id}`}
                isIconOnly
                variant="light"
                size="sm"
              >
                <Icon icon="solar:settings-linear" className="text-lg text-default-400" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Étapes</h1>
        <Button color="primary" endContent={<Icon icon="solar:add-circle-linear" />} onPress={handleCreate}>
          Nouvelle Étape
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={etapes}
          renderCell={renderCell}
          searchPlaceholder="Rechercher une étape..."
        />
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 sm:hidden">
        {etapes.map((etape) => (
          <Card key={etape.id} className="w-full" isPressable onPress={() => handleEditInfo(etape)}>
            <CardBody className="flex flex-row gap-4 items-start">
              <div className="flex-none">
                <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center overflow-hidden">
                  {etape.image_src ? (
                    <Image
                      src={etape.image_src}
                      alt={etape.name}
                      width={48}
                      height={48}
                      className="object-cover"
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
                  <span className="text-medium font-semibold truncate">{etape.name}</span>
                  <div className="text-default-400">
                    <Icon icon="solar:pen-linear" width={20} />
                  </div>
                </div>
                <p className="text-tiny text-default-400 line-clamp-2">{etape.description}</p>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-tiny text-default-500">
                    <Icon icon="solar:target-linear" width={14} />
                    <span>{etape._count?.objectifs || 0} obj.</span>
                  </div>

                  <Button
                    as={Link}
                    href={`/admin/etapes/${etape.id}`}
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="h-8"
                    endContent={<Icon icon="solar:settings-linear" />}
                  >
                    Gérer
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <EtapeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        etape={selectedEtape}
      />
    </div>
  );
}
