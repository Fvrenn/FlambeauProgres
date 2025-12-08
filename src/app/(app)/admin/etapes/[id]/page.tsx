import React from "react";
import prisma from "@/lib/prisma";
import EtapeDetailClientPage from "./ClientPage";
import { redirect } from "next/navigation";

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
