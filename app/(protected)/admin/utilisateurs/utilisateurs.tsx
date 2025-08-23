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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Spinner,
  Tooltip,
} from "@heroui/react";

import { TrashBinTrash } from "@solar-icons/react";
import { Eye } from "@solar-icons/react";
import { Pen2 } from "@solar-icons/react";
import { Magnifer } from "@solar-icons/react";
import { AltArrowDown } from "@solar-icons/react";
import { User as UserType } from "@/src/types/user";
import { useUsers } from "@/src/hooks/use.user";
import { useUpdateUserRole } from "@/src/hooks/useUpdateUserRole";
import { useSession } from "@/src/lib/auth-client";

// Icônes utilitaires

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="24"
    role="presentation"
    viewBox="0 0 24 24"
    width="24"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M6 12h12" />
      <path d="M12 18V6" />
    </g>
  </svg>
);

const VerticalDotsIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="24"
    role="presentation"
    viewBox="0 0 24 24"
    width="24"
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

// Colonnes adaptées au modèle User
export const columns = [
  { name: "USER", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "CREATED", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const roleColorMap: Record<
  string,
  "success" | "danger" | "warning" | "primary"
> = {
  ADMIN: "danger",
  CHEF: "success",
  REFERENT: "warning",
};

const roleOptions = [
  { name: "Admin", uid: "ADMIN" },
  { name: "Chef", uid: "CHEF" },
  { name: "Référent", uid: "REFERENT" },
];

export default function UserTable() {
  const { data: users = [], isLoading, error } = useUsers();
  const updateUserRoleMutation = useUpdateUserRole();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [roleFilter, setRoleFilter] = React.useState<any>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const classNames = React.useMemo(
    () => ({
      th: ["bg-background"],
    }),
    []
  );
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== roleOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(roleFilter).includes(user.role)
      );
    }

    return filteredUsers;
  }, [users, filterValue, roleFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: UserType, b: UserType) => {
      let first: any = a[sortDescriptor.column as keyof UserType];
      let second: any = b[sortDescriptor.column as keyof UserType];

      if (sortDescriptor.column === "createdAt") {
        first = new Date(first).getTime();
        second = new Date(second).getTime();
      } else if (typeof first === "string") {
        first = first.toLowerCase();
        second = second.toLowerCase();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleRoleChange = React.useCallback(
    (userId: string, newRole: string) => {
      if (currentUser?.id === userId) {
        return;
      }
      updateUserRoleMutation.mutate({
        userId,
        role: newRole as "ADMIN" | "CHEF" | "REFERENT",
      });
    },
    [updateUserRoleMutation]
  );

  const renderCell = React.useCallback(
    (user: UserType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserType];
      const isCurrentUser = currentUser?.id === user.id;

     switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.image || undefined }}
              description={user.email}
              name={user.name}
            >
              {user.name}
              {isCurrentUser && " (Vous)"}
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
            <Dropdown>
              <DropdownTrigger>
                <Chip
                  className={`capitalize ${isCurrentUser ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  endContent={!isCurrentUser && <AltArrowDown weight="Outline" size={14} />}
                  color={roleColorMap[user.role]}
                  size="sm"
                  variant="flat"
                >
                  {user.role.toLowerCase()}
                  {isCurrentUser && " (Vous)"}
                </Chip>
              </DropdownTrigger>
              {!isCurrentUser && (
                <DropdownMenu
                  aria-label="Changer le rôle"
                  selectionMode="single"
                  selectedKeys={new Set([user.role])}
                  onSelectionChange={(keys) => {
                    const newRole = Array.from(keys)[0] as string;
                    if (newRole && newRole !== user.role) {
                      handleRoleChange(user.id, newRole);
                    }
                  }}
                >
                  {roleOptions.map((role) => (
                    <DropdownItem key={role.uid} className="capitalize">
                      {role.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </Dropdown>
          );
        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">
                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view">
                    <div className="flex items-center gap-2">
                      <Eye weight="Linear" size={16} />
                      Voir détails
                    </div>
                  </DropdownItem>
                  <DropdownItem key="edit">
                    <div className="flex items-center gap-2">
                      <Pen2 weight="Linear" size={16} />
                      Modifier
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    isDisabled={isCurrentUser}
                  >
                    <div className="flex items-center gap-2">
                      <TrashBinTrash weight="Linear" size={16} />
                      Supprimer
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleRoleChange, currentUser?.id]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Rechercher par nom ou email..."
            startContent={<Magnifer weight="Linear" size={16} color="#00000" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <AltArrowDown weight="Linear" size={16} color="#00000" />
                  }
                  variant="flat"
                >
                  Rôle
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrer par rôle"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {roleOptions.map((role) => (
                  <DropdownItem key={role.uid} className="capitalize">
                    {role.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-medium-black text-white"
              endContent={<PlusIcon />}
            >
              Ajouter utilisateur
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} utilisateurs
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
    roleFilter,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
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
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Précédent
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Suivant
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

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
        <p className="text-danger">
          Erreur lors du chargement des utilisateurs
        </p>
      </div>
    );
  }

  return (
    <Table
      isHeaderSticky
      aria-label="Table des utilisateurs avec pagination et tri"
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
          wrapper: "after:bg-foreground after:text-background text-background",
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
      <TableBody emptyContent={"Aucun utilisateur trouvé"} items={sortedItems}>
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
