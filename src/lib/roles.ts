import type { UserRole } from "@prisma/client";

export const roleColorMap: Record<
  UserRole,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  CHEF: "default",
  REFERENT: "secondary",
  ADMIN: "danger",
};
