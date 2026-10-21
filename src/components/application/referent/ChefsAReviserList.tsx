"use client";

import type { ChefAReviser } from "@/types";

import React from "react";
import { Chip } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Icon } from "@/lib/icons";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { BoutonOuvrirLigne } from "@/components/admin/BoutonOuvrirLigne";
import { CelluleUtilisateur } from "@/components/admin/CelluleUtilisateur";
import { Avatar, Card, CardBody } from "@/components/ui";

type ChefsAReviserListProps = {
  chefs: ChefAReviser[];
};

const columns: Column[] = [
  { key: "chefName", label: "CHEF", sortable: true },
  { key: "etape", label: "ÉTAPE" },
  { key: "statut", label: "STATUT" },
  { key: "actions", label: "ACTIONS" },
];

export default function ChefsAReviserList({ chefs }: ChefsAReviserListProps) {
  const router = useRouter();

  if (chefs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-dashboard-card rounded-full flex items-center justify-center mx-auto text-nav-active">
            <Icon className="text-2xl" icon="solar:verified-check-linear" />
          </div>
          <p className="text-default-500 text-sm">
            Aucun badge en attente de révision finale.
          </p>
        </div>
      </div>
    );
  }

  const data = chefs.map(({ chef, etapeId, etapeName }) => ({
    ...chef,
    id: `${etapeId}-${chef.id}`,
    chefId: chef.id,
    chefName: chef.name,
    chefEmail: chef.email,
    etapeId,
    etapeName,
  }));

  const reviseHref = (dossier: (typeof data)[number]) =>
    `/referent/revision?chefId=${dossier.chefId}&etapeId=${dossier.etapeId}`;

  const renderCell = (chef: (typeof data)[number], columnKey: React.Key) => {
    switch (columnKey) {
      case "chefName":
        return <CelluleUtilisateur utilisateur={chef} />;
      case "etape":
        return (
          <span className="text-sm text-default-500">{chef.etapeName}</span>
        );
      case "statut":
        return (
          <Chip
            color="success"
            size="sm"
            startContent={
              <Icon icon="solar:verified-check-linear" width={14} />
            }
            variant="flat"
          >
            Prêt
          </Chip>
        );
      case "actions":
        return (
          <BoutonOuvrirLigne
            label="Réviser le badge"
            onOuvrir={() => router.push(reviseHref(chef))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={data}
          renderCell={renderCell}
          searchPlaceholder="Rechercher un chef..."
          onRowAction={(key) => {
            const chef = data.find((item) => item.id === key);

            if (chef) router.push(reviseHref(chef));
          }}
        />
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {data.map((chef) => (
          <Card
            key={chef.id}
            isPressable
            className="w-full"
            onClick={() => router.push(reviseHref(chef))}
          >
            <CardBody className="flex-row items-center gap-3">
              <Avatar name={chef.name} size="md" src={chef.image} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold truncate">
                  {chef.name}
                </span>
                <span className="text-xs text-default-400 truncate">
                  {chef.etapeName}
                </span>
              </div>
              <Chip color="success" size="sm" variant="flat">
                Prêt
              </Chip>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
