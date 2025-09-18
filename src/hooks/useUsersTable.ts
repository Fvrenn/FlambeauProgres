import { useState, useMemo, useCallback } from "react";
import { useUsers } from "@/src/hooks/use.user";
import { useUpdateUserRole } from "@/src/hooks/useUpdateUserRole";
import { useSession } from "@/src/lib/auth-client";
import type { User } from "@/src/types/user";
import type { Selection, SortDescriptor as HeroSortDescriptor } from "@heroui/react";

export interface TableFilters {
  search: string;
  role: Selection;
  page: number;
  rowsPerPage: number;
}

export interface SortDescriptor {
  column: string;
  direction: "ascending" | "descending";
}

export function useUsersTable() {
  const { data: users = [], isLoading, error } = useUsers();
  const updateUserRoleMutation = useUpdateUserRole();
  const { data: session } = useSession();

  // État des filtres et pagination
  const [filters, setFilters] = useState<TableFilters>({
    search: "",
    role: "all",
    page: 1,
    rowsPerPage: 5,
  });

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });

  // Utilisateur actuel
  const currentUser = session?.user;

  // Helper pour gérer Selection
  const getRoleSet = useCallback((selection: Selection): Set<string> => {
    if (selection === "all") return new Set(["all"]);
    return selection as Set<string>;
  }, []);

  const getSelectionSize = useCallback((selection: Selection): number => {
    if (selection === "all") return 0;
    return (selection as Set<string>).size;
  }, []);

  // Filtrage des données
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filtre par recherche
    if (filters.search) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par rôle
    const roleSet = getRoleSet(filters.role);
    if (!roleSet.has("all") && roleSet.size > 0) {
      result = result.filter((user) => roleSet.has(user.role));
    }

    return result;
  }, [users, filters.search, filters.role, getRoleSet]);

  // Tri des données
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a: User, b: User) => {
      let first: any = a[sortDescriptor.column as keyof User];
      let second: any = b[sortDescriptor.column as keyof User];

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
  }, [filteredUsers, sortDescriptor]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / filters.rowsPerPage) || 1;
  
  const paginatedUsers = useMemo(() => {
    const start = (filters.page - 1) * filters.rowsPerPage;
    const end = start + filters.rowsPerPage;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, filters.page, filters.rowsPerPage]);

  // Actions
  const updateFilter = useCallback((key: keyof TableFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }), // Reset page sauf si on change la page
    }));
  }, []);

  const handleRoleChange = useCallback(
    (userId: string, newRole: "ADMIN" | "CHEF" | "REFERENT") => {
      if (currentUser?.id === userId) return;
      updateUserRoleMutation.mutate({ userId, role: newRole });
    },
    [updateUserRoleMutation, currentUser?.id]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      role: "all",
      page: 1,
      rowsPerPage: 5,
    });
  }, []);

  // Adapter setSortDescriptor pour HeroUI
  const handleSortChange = useCallback((descriptor: HeroSortDescriptor) => {
    setSortDescriptor({
      column: descriptor.column as string,
      direction: descriptor.direction,
    });
  }, []);

  return {
    // Data
    users: paginatedUsers,
    totalUsers: users.length,
    filteredCount: filteredUsers.length,
    currentUser,
    isLoading,
    error,

    // État
    filters,
    selectedKeys,
    sortDescriptor,
    totalPages,

    // Actions
    updateFilter,
    setSelectedKeys,
    setSortDescriptor: handleSortChange,
    handleRoleChange,
    clearFilters,

    // Helpers
    getSelectionSize,

    // Statut des mutations
    isUpdatingRole: updateUserRoleMutation.isPending,
  };
}