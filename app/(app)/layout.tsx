import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: new Headers(headersList),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  if (!("role" in user)) {
    redirect("/login");
  }

  return <>{children}</>;
}