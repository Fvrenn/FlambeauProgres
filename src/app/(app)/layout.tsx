import React from "react";

import { getUser } from "@/lib/auth-server";
import { redirectToLogin } from "@/lib/auth-redirect";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user)) {
    await redirectToLogin();
  }

  return <>{children}</>;
}
