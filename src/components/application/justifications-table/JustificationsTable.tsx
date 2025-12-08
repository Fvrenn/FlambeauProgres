"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {
  columns,
  renderCell,
  type JustificationAvecRelations,
} from "./JustificationsTableColumns";

type JustificationsTableProps = {
  justifications: JustificationAvecRelations[];
};

export default function JustificationsTable({
  justifications,
}: JustificationsTableProps) {
  return (
    <Table aria-label="Tableau des justifications à valider">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>{column.name}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={justifications}
        emptyContent={"Aucune justification à valider pour le moment."}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}