"use client";

import { User, UserRole } from "@prisma/client";
import React from "react";
import { Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import UserModal from "./_components/UserModal";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Badge, Avatar, Card, CardBody, Button } from "@/components/ui";
import { roleColorMap } from "@/lib/roles";

type UsersClientPageProps = {
  users: User[];
};

const columns: Column[] = [
  { key: "user", label: "UTILISATEUR", sortable: true },
  { key: "role", label: "RÔLE", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export default function UsersClientPage({ users }: UsersClientPageProps) {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user":
        return (
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="sm" src={user.image || undefined} />
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
          <Badge
            className="capitalize"
            color={roleColorMap[user.role as UserRole]}
            size="sm"
            variant="flat"
          >
            {user.role}
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
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Gestion des Utilisateurs</h1>
      </div>

      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={users}
          renderCell={renderCell}
          searchPlaceholder="Rechercher un utilisateur..."
        />
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {users.map((user) => (
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
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      color={roleColorMap[user.role as UserRole]}
                      size="sm"
                    >
                      {user.role}
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
