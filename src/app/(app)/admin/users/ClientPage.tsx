"use client";

import type { UserAdmin, UserResume } from "@/types";

import { UserRole } from "@prisma/client";
import React from "react";
import { Select, SelectItem, Tooltip } from "@heroui/react";

import UserModal from "./_components/UserModal";

import { Icon } from "@/lib/icons";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { CelluleUtilisateur } from "@/components/admin/CelluleUtilisateur";
import { Badge, Avatar, Card, CardBody, Button } from "@/components/ui";
import { roleColorMap, roleLabelMap } from "@/lib/roles";
import { cleGroupe, compterParGroupe } from "@/lib/groupes";

type UsersClientPageProps = {
  users: UserAdmin[];
};

const columns: Column[] = [
  { key: "user", label: "UTILISATEUR", sortable: true },
  { key: "groupe", label: "GROUPE", sortable: true },
  { key: "role", label: "RÔLE", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export default function UsersClientPage({ users }: UsersClientPageProps) {
  const [selectedUser, setSelectedUser] = React.useState<UserResume | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [groupeFiltre, setGroupeFiltre] = React.useState<string | null>(null);

  const effectifs = React.useMemo(() => compterParGroupe(users), [users]);
  const usersAffiches = React.useMemo(
    () =>
      groupeFiltre
        ? users.filter((user) => cleGroupe(user.groupe) === groupeFiltre)
        : users,
    [users, groupeFiltre],
  );

  const handleEdit = (user: UserResume) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const renderCell = React.useCallback(
    (user: UserAdmin, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserAdmin];

      switch (columnKey) {
        case "user":
          return <CelluleUtilisateur utilisateur={user} />;
        case "groupe":
          return user.groupe ? (
            <span className="text-small">{user.groupe}</span>
          ) : (
            <span className="text-small text-default-400">Sans groupe</span>
          );
        case "role":
          return (
            <Badge color={roleColorMap[user.role as UserRole]}>
              {roleLabelMap[user.role as UserRole]}
            </Badge>
          );
        case "actions":
          return (
            <div className="flex items-center justify-end w-full pr-8">
              <Tooltip content="Modifier l'utilisateur">
                <Button
                  isIconOnly
                  color="default"
                  size="sm"
                  startIcon="solar:pen-linear"
                  variant="ghost"
                  onClick={() => handleEdit(user)}
                />
              </Tooltip>
            </div>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Gestion des Utilisateurs</h1>
      </div>

      <Select
        aria-label="Filtrer par groupe"
        className="sm:max-w-72"
        classNames={{
          trigger:
            "bg-dashboard-panel shadow-inset-border data-[hover=true]:bg-dashboard-panel-hover",
          popoverContent: "bg-dashboard-panel border border-dashboard-border",
        }}
        label="Groupe"
        labelPlacement="outside"
        placeholder={`Tous les groupes (${users.length})`}
        selectedKeys={groupeFiltre ? [groupeFiltre] : []}
        size="sm"
        onSelectionChange={(keys) =>
          setGroupeFiltre((Array.from(keys)[0] as string | undefined) ?? null)
        }
      >
        {effectifs.map((effectif) => (
          <SelectItem key={effectif.cle} textValue={effectif.libelle}>
            <div className="flex items-center justify-between gap-3">
              <span>{effectif.libelle}</span>
              <span className="text-tiny text-default-500">
                {effectif.total} membre{effectif.total > 1 ? "s" : ""}
              </span>
            </div>
          </SelectItem>
        ))}
      </Select>

      <div className="hidden sm:block">
        <AdminDataTable
          key={groupeFiltre ?? "tous"}
          columns={columns}
          data={usersAffiches}
          renderCell={renderCell}
          searchPlaceholder="Rechercher un utilisateur..."
        />
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {usersAffiches.map((user) => (
          <Card
            key={user.id}
            isPressable
            className="w-full"
            onClick={() => handleEdit(user)}
          >
            <CardBody className="flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar
                  name={user.name}
                  size="md"
                  src={user.image || undefined}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-medium font-semibold truncate">
                    {user.name}
                  </span>
                  <span className="text-tiny text-default-400 truncate">
                    {user.email}
                  </span>
                  <span className="text-tiny text-default-500 truncate">
                    {user.groupe ?? "Sans groupe"}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color={roleColorMap[user.role as UserRole]}>
                      {roleLabelMap[user.role as UserRole]}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-default-400">
                <Icon icon="solar:pen-linear" width={20} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
