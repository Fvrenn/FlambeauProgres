import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Profil | Flambeau Progres",
};

export default async function ProfilPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ClientPage user={user} />;
}
