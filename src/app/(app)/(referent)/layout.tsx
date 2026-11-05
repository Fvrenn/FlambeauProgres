import React from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { estReferent } from "@/lib/roles";

export default async function ReferentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || !estReferent(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
