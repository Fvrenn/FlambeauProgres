"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";

import { useUsersTable } from "@/src/hooks/useUsersTable-clean";
import { UserCell } from "@/src/components/users/cells/UserCell";
import { RoleCell } from "@/src/components/users/cells/RoleCell";
import { ActionsCell } from "@/src/components/users/cells/ActionsCell";
import { TableFilters } from "@/src/components/users/TableFilters";
import { TABLE_COLUMNS, ROWS_PER_PAGE_OPTIONS, type UserTableColumn } from "@/src/components/users/constants";
import type { User } from "@/src/types/user";

export default function UserTable() {
  const {
    users,
    totalUsers,
    filteredCount,
    currentUser,
    isLoading,
    error,
    filters,
    selectedKeys,
    sortDescriptor,
    totalPages,
    updateFilter,
    setSelectedKeys,
    setSortDescriptor,
    handleRoleChange,
    clearFilters,
    getSelectionSize,
  } = useUsersTable();

  const renderCell = React.useCallback(
    (user: User, columnKey: React.Key) => {
      const isCurrentUser = currentUser?.id === user.id;

      switch (columnKey) {
        case "name":
          return <UserCell user={user} isCurrentUser={isCurrentUser} />;
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{user.email}</p>
            </div>
          );
        case "role":
          return (
            <RoleCell
              user={user}
              isCurrentUser={isCurrentUser}
              onRoleChange={handleRoleChange}
            />
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
            <ActionsCell
              userId={user.id}
              isCurrentUser={isCurrentUser}
              onView={(id) => console.log("View user:", id)}
              onEdit={(id) => console.log("Edit user:", id)}
              onDelete={(id) => console.log("Delete user:", id)}
            />
          );
        default:
          return user[columnKey as keyof User];
      }
    },
    [handleRoleChange, currentUser?.id]
  );

  const topContent = (
    <TableFilters
      searchValue={filters.search}
      roleFilter={filters.role}
      totalUsers={totalUsers}
      onSearchChange={(value) => updateFilter("search", value)}
      onRoleFilterChange={(selection) => updateFilter("role", selection)}
      onClear={clearFilters}
      onAddUser={() => console.log("Add user")}
    />
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {getSelectionSize(selectedKeys) === 0 
          ? `${filteredCount} utilisateurs`
          : `${getSelectionSize(selectedKeys)} sur ${filteredCount} sélectionnés`
        }
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        page={filters.page}
        total={totalPages}
        onChange={(page) => updateFilter("page", page)}
        classNames={{
          cursor: "bg-medium-black text-white",
        }}
      />
      <div className="hidden sm:flex w-[30%] justify-end">
        <label className="flex items-center text-default-400 text-small">
          Lignes par page:
          <select
            className="bg-transparent outline-none text-default-400 text-small ml-2"
            value={filters.rowsPerPage}
            onChange={(e) => updateFilter("rowsPerPage", Number(e.target.value))}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

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
    <Table
      isHeaderSticky
      aria-label="Table des utilisateurs"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
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
      <TableHeader columns={TABLE_COLUMNS}>
        {(column: UserTableColumn) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="Aucun utilisateur trouvé" items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}