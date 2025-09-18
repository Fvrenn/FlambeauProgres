import { getUser } from "@/src/lib/auth-session";
import { redirect } from "next/navigation";
import AdminUserList from "./utilisateurs-refactored";

export default async function AdminUtilisateurPage() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }
  return <AdminUserList />;
}
