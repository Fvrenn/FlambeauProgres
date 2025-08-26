"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { Eye } from "@solar-icons/react";
import { Magnifer } from "@solar-icons/react";
import { CheckCircle } from "@solar-icons/react";
import { CloseCircle } from "@solar-icons/react";
import { Justification, StatutJustification } from "@/src/types/justification";
import { useJustificationsForReferent } from "@/src/hooks/useJustificationsForReferent";
import { useSession } from "@/src/lib/auth-client";
import type { JustificationWithRelations } from "@/src/types/justificationWithRelations";
import JustificationViewModal from "./JustificationViewModal";
import { useState, useEffect } from "react";

// Colonnes du tableau
export const columns = [
  { name: "CHEF", uid: "chef", sortable: true },
  { name: "BADGE", uid: "badge", sortable: true },
  { name: "ID OBJECTIF", uid: "id", sortable: true },
  { name: "DATE ENVOI", uid: "soumiseAt", sortable: true },
  { name: "STATUT", uid: "statut", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<
  StatutJustification,
  "warning" | "success" | "danger" | "primary" | "secondary"
> = {
  BROUILLON: "secondary",
  SOUMISE: "warning",
  EN_COURS: "primary",
  DEMANDE_PRECISION: "warning",
  VALIDEE: "success",
  REFUSEE: "danger",
};

const statusLabelMap: Record<StatutJustification, string> = {
  BROUILLON: "Brouillon",
  SOUMISE: "Soumise",
  EN_COURS: "En cours",
  DEMANDE_PRECISION: "Précision demandée",
  VALIDEE: "Validée",
  REFUSEE: "Refusée",
};

export default function FileAttentePage() {
  const { data: session } = useSession();
  const referentId = session?.user?.id;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const {
    data: justifications = [],
    isLoading,
    error,
  } = useJustificationsForReferent(referentId);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);
  const [selectedJustification, setSelectedJustification] =
    React.useState<JustificationWithRelations | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const classNames = React.useMemo(
    () => ({
      th: ["bg-background"],
    }),
    []
  );

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredJustifications = [...justifications];

    if (hasSearchFilter) {
      filteredJustifications = filteredJustifications.filter(
        (justification) =>
          justification.chef.name
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          justification.badge.name
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          justification.id?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredJustifications;
  }, [justifications, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort(
      (a: JustificationWithRelations, b: JustificationWithRelations) => {
        let first: any =
          a[sortDescriptor.column as keyof JustificationWithRelations];
        let second: any =
          b[sortDescriptor.column as keyof JustificationWithRelations];

        if (sortDescriptor.column === "chef") {
          first = a.chef.name.toLowerCase();
          second = b.chef.name.toLowerCase();
        } else if (sortDescriptor.column === "badge") {
          first = a.badge.name.toLowerCase();
          second = b.badge.name.toLowerCase();
        } else if (sortDescriptor.column === "soumiseAt") {
          first = new Date(first || 0).getTime();
          second = new Date(second || 0).getTime();
        } else if (typeof first === "string") {
          first = first.toLowerCase();
          second = second.toLowerCase();
        }

        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, items]);

  const handleViewDetails = (justification: JustificationWithRelations) => {
    setSelectedJustification(justification);
    onOpen();
  };

  const handleApprove = (justificationId: string) => {
    // Logique pour valider la justification
    console.log("Valider:", justificationId);
  };

  const handleReject = (justificationId: string) => {
    // Logique pour refuser la justification
    console.log("Refuser:", justificationId);
  };

  const handleRequestPrecision = (justificationId: string) => {
    // Logique pour demander des précisions
    console.log("Demander précision:", justificationId);
  };

  const renderCell = React.useCallback(
    (justification: JustificationWithRelations, columnKey: React.Key) => {
      const cellValue =
        justification[columnKey as keyof JustificationWithRelations];

      switch (columnKey) {
        case "chef":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src: justification.chef.image || undefined,
              }}
              description={justification.chef.email}
              name={justification.chef.name}
            >
              {justification.chef.name}
            </User>
          );
        case "badge":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{justification.badge.name}</p>
            </div>
          );
        case "id":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm font-mono">
                {justification.objectif.code}
              </p>
            </div>
          );
        case "soumiseAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">
                {justification.soumiseAt
                  ? new Date(justification.soumiseAt).toLocaleDateString(
                      "fr-FR"
                    )
                  : "Non soumise"}
              </p>
              {justification.soumiseAt && (
                <p className="text-xs text-gray-500">
                  {new Date(justification.soumiseAt).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              )}
            </div>
          );
        case "statut":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[justification.statut || "BROUILLON"]}
              size="sm"
              variant="flat"
            >
              {statusLabelMap[justification.statut || "BROUILLON"]}
            </Chip>
          );
        case "actions":
          const isPending =
            justification.statut === "SOUMISE" ||
            justification.statut === "EN_COURS";
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleViewDetails(justification)}
              >
                <Eye weight="Linear" size={16} />
              </Button>
            </div>
          );
        default:
          if (
            typeof cellValue === "object" &&
            cellValue !== null &&
            "name" in cellValue
          ) {
            return (cellValue as { name: string }).name;
          }
          return cellValue as React.ReactNode;
      }
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const formatDate = React.useCallback((dateString: string | undefined) => {
    if (!dateString) return "Non soumise";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  }, []);

  const formatTime = React.useCallback((dateString: string | undefined) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Rechercher par chef, badge ou ID..."
            startContent={<Magnifer weight="Linear" size={16} color="#00000" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {justifications.length} justifications en attente
          </span>
          <label className="flex items-center text-default-400 text-small">
            Lignes par page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    justifications.length,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les éléments sélectionnés"
            : `${selectedKeys.size} sur ${filteredItems.length} sélectionnés`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-medium-black text-white",
          }}
        />
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            File d'attente des justifications
          </h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-danger">
          Erreur lors du chargement des justifications
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          File d'attente des justifications
        </h1>
        <p className="text-gray-600">
          Gérez les justifications envoyées par les chefs en attente de
          validation.
        </p>
      </div>

      <Table
        isHeaderSticky
        aria-label="Table des justifications en attente"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"Aucune justification trouvée"}
          items={sortedItems}
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
      {selectedJustification && (
        <JustificationViewModal
          isOpen={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedJustification(null);
              onClose();
            } else {
              onOpen();
            }
          }}
          justification={selectedJustification}
        />
      )}
    </div>
  );
}
