"use client";

import React from "react";
import { Button, AvatarGroup, Avatar, Tooltip, Input, Card, CardBody, CardFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import TroupeModal from "./_components/TroupeModal";

type TroupesClientPageProps = {
  troupes: any[];
  users: any[];
};

export default function TroupesClientPage({ troupes, users }: TroupesClientPageProps) {
  const [selectedTroupeId, setSelectedTroupeId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Derive selectedTroupe from the fresh props
  const selectedTroupe = React.useMemo(() => {
    return selectedTroupeId ? troupes.find((t) => t.id === selectedTroupeId) : null;
  }, [troupes, selectedTroupeId]);

  const handleEdit = (troupe: any) => {
    setSelectedTroupeId(troupe.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTroupeId(null);
    setIsModalOpen(true);
  };

  /* Helper to filter troupes based on search */
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredTroupes = React.useMemo(() => {
    return troupes.filter((t) =>
      t.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [troupes, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Troupes</h1>
          <p className="text-default-500 text-small">Gérez vos troupes et leurs membres</p>
        </div>

        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-linear" width={20} />}
          onPress={handleCreate}
          className="w-full sm:w-auto"
        >
          Nouvelle Troupe
        </Button>
      </div>

      <Input
        classNames={{
          base: "max-w-full sm:max-w-[44%]",
          inputWrapper: "h-12",
        }}
        placeholder="Rechercher une troupe..."
        size="sm"
        startContent={<Icon icon="solar:magnifer-linear" className="text-default-400" width={18} />}
        value={searchTerm}
        onValueChange={setSearchTerm}
        isClearable
        onClear={() => setSearchTerm("")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTroupes.map((troupe) => (
          <div
            key={troupe.id}
            className="group relative flex flex-col gap-3 p-4 bg-content1 rounded-medium shadow-small cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => handleEdit(troupe)}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-medium font-semibold">{troupe.nom}</span>
                <span className="text-tiny text-default-400">{troupe._count?.membres || 0} membre(s)</span>
              </div>
              <div className="p-2 bg-default-100 rounded-full text-default-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <Icon icon="solar:pen-linear" width={18} />
              </div>
            </div>

            <div className="mt-2">
              {troupe.membres && troupe.membres.length > 0 ? (
                <AvatarGroup isBordered max={5} size="sm" className="justify-start">
                  {troupe.membres.map((membre: any) => (
                    <Avatar key={membre.id} src={membre.image} name={membre.name} />
                  ))}
                </AvatarGroup>
              ) : (
                <span className="text-tiny text-default-400 italic">Aucun membre assigné</span>
              )}
            </div>
          </div>
        ))}

        {filteredTroupes.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-default-400 gap-2 text-center">
            <Icon icon="solar:folder-with-files-outline" width={40} />
            <p>Aucune troupe trouvée</p>
          </div>
        )}
      </div>

      <TroupeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTroupeId(null);
        }}
        troupe={selectedTroupe}
        users={users}
      />
    </div>
  );
}
