import React from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { estAdmin } from "@/lib/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !("role" in user) || !estAdmin(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
