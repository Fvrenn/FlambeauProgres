"use client";

import type { getUser } from "@/lib/auth-server";
import type { UserRole } from "@prisma/client";

import React from "react";
import { Card, CardBody, Avatar } from "@heroui/react";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

type ProfilUser = NonNullable<Awaited<ReturnType<typeof getUser>>> & {
  role?: UserRole;
};

function ProfilIdentity({ user }: { user: ProfilUser }) {
  return (
    <div className="flex items-center gap-6">
      <Avatar
        className="w-20 h-20 text-large"
        color="primary"
        name={user?.name || "U"}
        src={user?.image || undefined}
      />
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-xl font-semibold leading-none mb-2">
          {user?.name}
        </h3>
        <p className="text-small text-default-500">{user?.email}</p>
        <p className="text-small text-default-500 capitalize mt-1">
          Rôle :{" "}
          <span className="font-medium text-foreground">
            {user?.role?.toLowerCase() || "chef"}
          </span>
        </p>
      </div>
    </div>
  );
}

function ProfilFormWordpress({ user }: { user: ProfilUser }) {
  return (
    <Card className="w-full bg-dashboard-panel shadow-none border border-dashboard-border">
      <CardBody className="p-6 gap-6">
        <ProfilIdentity user={user} />
        <p className="text-small text-default-500">
          Ces informations sont gérées depuis WordPress.
          {WORDPRESS_URL && (
            <>
              {" "}
              <a
                className="underline"
                href={`${WORDPRESS_URL}/wp-admin/profile.php`}
                rel="noreferrer"
                target="_blank"
              >
                Modifier sur WordPress
              </a>
            </>
          )}
        </p>
      </CardBody>
    </Card>
  );
}

export function ProfilForm({ user }: { user: ProfilUser }) {
  return <ProfilFormWordpress user={user} />;
}
