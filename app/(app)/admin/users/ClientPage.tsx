"use client";

import React from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { User, UserRole } from "@prisma/client";
import { User as UserIcon, Chip, Tooltip, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import UserModal from "./_components/UserModal";

type UsersClientPageProps = {
  users: (User & { troupe: { nom: string } | null })[];
  troupes: any[];
};

const columns: Column[] = [
  { key: "user", label: "UTILISATEUR", sortable: true },
  { key: "role", label: "RÔLE", sortable: true },
  { key: "troupe", label: "TROUPE", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

const roleColorMap: Record<UserRole, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  CHEF: "default",
  REFERENT: "secondary",
  ADMIN: "danger",
};

export default function UsersClientPage({ users, troupes }: UsersClientPageProps) {
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user":
        return (
          <div className="flex items-center gap-3">
            <Avatar src={user.image} name={user.name} size="sm" />
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{user.name}</p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {user.email}
              </p>
            </div>
          </div>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={roleColorMap[user.role as UserRole]}
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        );
      case "troupe":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {user.troupe?.nom || "Aucune"}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier l'utilisateur">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEdit(user)}
              >
                <Icon icon="solar:pen-linear" />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
      </div>
      
      <AdminDataTable
        columns={columns}
        data={users}
        renderCell={renderCell}
        searchPlaceholder="Rechercher un utilisateur..."
      />

      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          troupes={troupes}
        />
      )}
    </div>
  );
}
