"use client";

import React from "react";
import { User, Button, Chip } from "@heroui/react";
import { type User as UserType } from "@prisma/client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ChefsAReviserListProps = {
  chefs: UserType[];
};

export default function ChefsAReviserList({ chefs }: ChefsAReviserListProps) {
  const searchParams = useSearchParams();
  const etapeId = searchParams.get("etapeId");

  if (chefs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center mx-auto text-default-400">
            <Icon className="text-2xl" icon="solar:verified-check-linear" />
          </div>
          <p className="text-default-500 text-sm">
            Aucun badge en attente de révision finale.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chefs.map((chef) => (
        <div
          key={chef.id}
          className="border border-default-200 bg-content1 rounded-xl p-4 flex flex-col gap-4 hover:border-primary-200 transition-colors"
        >
          <div className="flex items-start justify-between">
            <User
              avatarProps={{
                src: chef.image || undefined,
                name: chef.name.charAt(0).toUpperCase(),
                size: "md",
              }}
              classNames={{
                name: "font-semibold text-foreground",
                description: "text-default-500",
              }}
              description={chef.email}
              name={chef.name}
            />
            <Chip
              className="hidden sm:flex"
              color="success"
              size="sm"
              variant="flat"
            >
              Prêt
            </Chip>
          </div>

          <div className="mt-auto pt-2">
            <Button
              fullWidth
              as={Link}
              className="font-medium"
              color="primary"
              endContent={<Icon icon="solar:arrow-right-linear" />}
              href={`/referent/revision?chefId=${chef.id}&etapeId=${etapeId}`}
              variant="flat"
            >
              Réviser le badge
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
