import React from "react";
import { redirect } from "next/navigation";

import EtapeDetailClientPage from "./ClientPage";

import { exigerRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEtapeDetailPage({ params }: PageProps) {
  await exigerRole(...ROLES_ADMIN);

  const { id } = await params;

  const etape = await prisma.etape.findUnique({
    where: { id },
    include: {
      objectifs: {
        orderBy: {
          code: "asc",
        },
      },
    },
  });

  if (!etape) {
    redirect("/admin/etapes");
  }

  return <EtapeDetailClientPage etape={etape} />;
}
