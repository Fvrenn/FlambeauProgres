import React from "react";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./client-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardClientLayout user={user}>
      {children}
    </DashboardClientLayout>
  );
}