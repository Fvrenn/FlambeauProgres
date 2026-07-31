"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { type User as UserType } from "@prisma/client";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Avatar, Card, CardBody, Button } from "@/components/ui";

type ChefsAReviserListProps = {
  chefs: UserType[];
};

const columns: Column[] = [
  { key: "chefName", label: "CHEF", sortable: true },
  { key: "statut", label: "STATUT" },
  { key: "actions", label: "ACTIONS" },
];

export default function ChefsAReviserList({ chefs }: ChefsAReviserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const etapeId = searchParams.get("etapeId");

  if (chefs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-dashboard-card rounded-full flex items-center justify-center mx-auto text-nav-active">
            <Icon className="text-2xl" icon="solar:verified-check-linear" />
          </div>
          <p className="text-default-500 text-sm">
            Aucun badge en attente de révision finale.
          </p>
        </div>
      </div>
    );
  }

  const data = chefs.map((chef) => ({
    ...chef,
    chefName: chef.name,
    chefEmail: chef.email,
  }));

  const reviseHref = (chefId: string) =>
    `/referent/revision?chefId=${chefId}&etapeId=${etapeId}`;

  const renderCell = (chef: (typeof data)[number], columnKey: React.Key) => {
    switch (columnKey) {
      case "chefName":
        return (
          <div className="flex items-center gap-3">
            <Avatar name={chef.name} size="sm" src={chef.image} />
            <div className="flex flex-col">
              <p className="text-bold text-small">{chef.name}</p>
              <p className="text-bold text-tiny text-default-400">
                {chef.email}
              </p>
            </div>
          </div>
        );
      case "statut":
        return (
          <Chip
            color="success"
            size="sm"
            startContent={
              <Icon icon="solar:verified-check-linear" width={14} />
            }
            variant="flat"
          >
            Prêt
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end w-full pr-4">
            <Button
              isIconOnly
              aria-label="Réviser le badge"
              color="default"
              size="sm"
              startIcon="solar:arrow-right-linear"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                router.push(reviseHref(chef.id));
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={data}
          renderCell={renderCell}
          searchPlaceholder="Rechercher un chef..."
          onRowAction={(key) => {
            const chef = data.find((item) => item.id === key);

            if (chef) router.push(reviseHref(chef.id));
          }}
        />
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {chefs.map((chef) => (
          <Card
            key={chef.id}
            isPressable
            className="w-full"
            onClick={() => router.push(reviseHref(chef.id))}
          >
            <CardBody className="flex-row items-center gap-3">
              <Avatar name={chef.name} size="md" src={chef.image} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold truncate">
                  {chef.name}
                </span>
                <span className="text-xs text-default-400 truncate">
                  {chef.email}
                </span>
              </div>
              <Chip color="success" size="sm" variant="flat">
                Prêt
              </Chip>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
