"use client";

import React from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Button, AvatarGroup, Avatar, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import TroupeModal from "./_components/TroupeModal";

type TroupesClientPageProps = {
  troupes: any[];
  users: any[];
};

const columns: Column[] = [
  { key: "nom", label: "NOM DE LA TROUPE", sortable: true },
  { key: "membres", label: "MEMBRES", sortable: true },
  { key: "chef", label: "CHEF / MEMBRES" },
  { key: "actions", label: "ACTIONS" },
];

export default function TroupesClientPage({ troupes, users }: TroupesClientPageProps) {
  const [selectedTroupe, setSelectedTroupe] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEdit = (troupe: any) => {
    setSelectedTroupe(troupe);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTroupe(null);
    setIsModalOpen(true);
  };

  const renderCell = React.useCallback((troupe: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "nom":
        return <p className="font-bold">{troupe.nom}</p>;
      case "membres":
        return (
          <div className="flex items-center gap-2">
            <Icon icon="solar:users-group-rounded-linear" className="text-default-400" />
            <span>{troupe._count.membres} membre(s)</span>
          </div>
        );
      case "chef":
        // Display avatars of members (up to 3)
        return (
            <AvatarGroup isBordered max={3} size="sm" className="justify-start">
            {troupe.membres.map((membre: any) => (
                <Avatar key={membre.id} src={membre.image} name={membre.name} />
            ))}
            </AvatarGroup>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier la troupe">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEdit(troupe)}
              >
                <Icon icon="solar:pen-linear" />
              </span>
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
        <h1 className="text-2xl font-bold">Gestion des Troupes</h1>
        <Button color="primary" endContent={<Icon icon="solar:add-circle-linear" />} onPress={handleCreate}>
          Nouvelle Troupe
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={troupes}
        renderCell={renderCell}
        searchPlaceholder="Rechercher une troupe..."
      />

      <TroupeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        troupe={selectedTroupe}
        users={users}
      />
    </div>
  );
}
