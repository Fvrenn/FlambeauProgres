import ClientPage from "./ClientPage";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";

export const metadata = {
  title: "Remonter un bug | Flambeau Progres",
};

export default async function SignalerBugPage() {
  const user = await getUser();

  if (!user) {
    await redirectToLogin();

    return null;
  }

  return <ClientPage user={user} />;
}
