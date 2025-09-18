export const ROLE_OPTIONS = [
  { name: "Admin", uid: "ADMIN" },
  { name: "Chef", uid: "CHEF" },
  { name: "Référent", uid: "REFERENT" },
];

export const ROLE_COLOR_MAP: Record<string, "success" | "danger" | "warning" | "primary"> = {
  ADMIN: "danger",
  CHEF: "success",
  REFERENT: "warning",
};

export interface UserTableColumn {
  name: string;
  uid: string;
  sortable: boolean;
}

export const TABLE_COLUMNS: UserTableColumn[] = [
  { name: "USER", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "CREATED", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions", sortable: false },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 15];