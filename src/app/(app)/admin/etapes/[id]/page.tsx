import React from "react";
import { redirect } from "next/navigation";

import EtapeDetailClientPage from "./ClientPage";

import prisma from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEtapeDetailPage({ params }: PageProps) {
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
