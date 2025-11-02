"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Button,
  Tooltip,
} from "@heroui/react";
import { type User as UserType } from "@prisma/client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ChefsAReviserTableProps = {
  chefs: UserType[];
};

export default function ChefsAReviserTable({ chefs }: ChefsAReviserTableProps) {
  const searchParams = useSearchParams();
  const etapeId = searchParams.get("etapeId");

  const columns = [
    { key: "chef", name: "Chef" },
    { key: "actions", name: "Actions" },
  ];

  const renderCell = (chef: UserType, columnKey: React.Key) => {
    switch (columnKey) {
      case "chef":
        return (
          <User
            avatarProps={{
              src: chef.image || undefined,
              name: chef.name.charAt(0).toUpperCase(),
            }}
            name={chef.name}
            description={chef.email}
          />
        );
      case "actions":
        return (
          <Tooltip content="Consulter les justifications et valider le badge">
            <Button
              as={Link}
              href={`/referent/revision?chefId=${chef.id}&etapeId=${etapeId}`}
              isIconOnly
              size="sm"
              variant="light"
            >
              <Icon
                icon="solar:document-add-linear"
                className="text-xl text-default-500"
              />
            </Button>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="Tableau des chefs ayant complété une étape">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>{column.name}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={chefs}
        emptyContent={"Aucun chef n'a complété cette étape pour le moment."}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}