import ClientPage from "./ClientPage";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";

export const metadata = {
  title: "Profil | Flambeau Progres",
};

export default async function ProfilPage() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();
  }

  return <ClientPage user={user} />;
}
