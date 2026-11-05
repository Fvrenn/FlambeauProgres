import React from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { accedeEspaceCoordination } from "@/lib/roles";

export default async function CoordinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || !accedeEspaceCoordination(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
