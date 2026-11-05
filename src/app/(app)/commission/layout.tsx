import React from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { accedeEspaceCommission } from "@/lib/roles";

export default async function CommissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || !accedeEspaceCommission(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
