export type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: string | null;
  role: "CHEF" | "REFERENT" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRole = {
  userId: string;
  role: "ADMIN" | "CHEF" | "REFERENT";
};