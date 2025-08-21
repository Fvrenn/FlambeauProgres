"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Spinner,
} from "@heroui/react";

import { TrashBinTrash } from '@solar-icons/react'
import { Eye } from '@solar-icons/react'
import { Pen2 } from '@solar-icons/react'
import { User as UserType } from '@/src/types/user';
import { getUsers } from '@/src/lib/user';

// Colonnes adaptées au modèle User
export const columns = [
  { name: "USER", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "role" },
  { name: "CREATED", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

const roleColorMap: Record<string, "success" | "danger" | "warning" | "primary"> = {
  ADMIN: "danger",
  CHEF: "success", 
  REFERENT: "warning",
};

export default function UserTable() {
  // React Query pour la gestion des données serveur
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const renderCell = (user: UserType, columnKey: keyof UserType | "actions") => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.image || "https://i.pravatar.cc/150?u=default" }}
            description={user.email}
            name={user.name}
          >
            {user.name}
          </User>
        );
      case "email":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{user.email}</p>
          </div>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={roleColorMap[user.role]}
            size="sm"
            variant="flat"
          >
            {user.role.toLowerCase()}
          </Chip>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Voir détails">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye weight="Linear" size={18} color='#0f4159' />
              </span>
            </Tooltip>
            <Tooltip content="Modifier utilisateur">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pen2 weight="Linear" size={18} color='#0f4159' />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Supprimer utilisateur">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <TrashBinTrash weight="Linear" size={18} color='#0f4159' />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-danger">Erreur lors du chargement des utilisateurs</p>
      </div>
    );
  }

  return (
    <Table aria-label="Table des utilisateurs">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as keyof UserType | "actions")}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}