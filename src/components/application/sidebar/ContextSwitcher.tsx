"use client";

import type { SessionUser } from "@/types";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Spacer,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cn } from "@heroui/react";

import { signOut } from "@/lib/auth-client";

function DropdownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.6665 7.50008L9.99984 4.16675L13.3332 7.50008"
        stroke="#A1A1AA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3332 12.5L9.99984 15.8333L6.6665 12.5"
        stroke="#A1A1AA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M2 13.04V11C2 5 4 3 10 3h4c6 0 8 2 8 8v2.04c0 .92-.41 1.79-1.11 2.33L13.5 22.58c-.63.49-1.37.49-2 0l-7.39-7.21A3.02 3.02 0 0 1 2 13.04Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M12 8v5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M8.5 11.5h7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
);

const ProfilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export default function ContextSwitcher({
  user,
  isCompact,
  triggerClassName,
}: {
  user: SessionUser;
  isCompact?: boolean;
  triggerClassName?: string;
}) {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const currentEtapeId = searchParams.get("etapeId");

  const currentEtape = user.etapesReferent?.find(
    (etape: { id: string }) => etape.id === currentEtapeId,
  );

  const getCurrentContext = () => {
    if (pathname.startsWith("/admin")) return "Interface Admin";

    if (pathname.startsWith("/referent") && currentEtape) {
      return `Référent : ${currentEtape.name}`;
    }
    if (pathname.startsWith("/referent")) return "Interface Référent";

    return "Mon Progrès (Chef)";
  };

  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

  const viewItems = [
    ...(pathname === "/"
      ? []
      : [
          <DropdownItem
            key="chef"
            as={Link}
            description="Accéder à votre progression"
            href="/"
            startContent={<DashboardIcon className={iconClasses} />}
          >
            Mon Progrès (Chef)
          </DropdownItem>,
        ]),
    ...(user.role === "REFERENT" && user.etapesReferent
      ? user.etapesReferent
          .filter((etape) => etape.id !== currentEtapeId)
          .map((etape) => (
            <DropdownItem
              key={`referent-${etape.id}`}
              as={Link}
              href={`/referent/dashboard?etapeId=${etape.id}`}
              startContent={
                etape.image_src ? (
                  <Image
                    alt={`Badge ${etape.name}`}
                    className="shrink-0"
                    height={24}
                    src={etape.image_src}
                    width={24}
                  />
                ) : (
                  <DashboardIcon className={iconClasses} />
                )
              }
            >
              Référent : {etape.name}
            </DropdownItem>
          ))
      : []),
    ...(user.role === "ADMIN" && !pathname.startsWith("/admin")
      ? [
          <DropdownItem
            key="admin"
            as={Link}
            description="Administrer la plateforme"
            href="/admin/dashboard"
            startContent={<DashboardIcon className={iconClasses} />}
          >
            Interface Admin
          </DropdownItem>,
        ]
      : []),
  ];

  return (
    <div className="flex flex-col">
      <Dropdown placement={isCompact ? "right-start" : "bottom-end"}>
        <DropdownTrigger>
          {isCompact ? (
            <Button isIconOnly className="w-10 h-10 rounded-full">
              {currentEtape?.image_src ? (
                <Image
                  alt={`Badge ${currentEtape.name}`}
                  className="rounded-full"
                  height={32}
                  src={currentEtape.image_src}
                  width={32}
                />
              ) : (
                <div
                  className={cn(
                    "flex items-center justify-center w-full h-full rounded-full",
                    triggerClassName ?? "bg-default-100",
                  )}
                >
                  <span className="text-xs font-medium text-default-600">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </Button>
          ) : (
            <Button
              fullWidth
              className={cn(
                "h-auto justify-between gap-3 rounded-xl border-1 border-divider p-2",
                triggerClassName ?? "bg-default-100",
              )}
              endContent={<DropdownIcon />}
            >
              <div className="flex w-full items-center gap-2">
                {currentEtape?.image_src && (
                  <Image
                    alt={`Badge ${currentEtape.name}`}
                    className="shrink-0"
                    height={36}
                    src={currentEtape.image_src}
                    width={36}
                  />
                )}
                <div className="flex flex-col text-left">
                  <p className="text-small font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-tiny text-default-400">
                    {getCurrentContext()}
                  </p>
                </div>
              </div>
            </Button>
          )}
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Menu de Contexte"
          itemClasses={{
            base: ["data-[hover=true]:border-divider"],
          }}
          variant="faded"
        >
          {[
            ...(viewItems.length > 0
              ? [
                  <DropdownSection
                    key="views"
                    showDivider
                    title="Changer de vue"
                  >
                    {viewItems}
                  </DropdownSection>,
                ]
              : []),
            <DropdownSection key="account" title="Compte">
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={
                  <Icon
                    className={`${iconClasses} text-danger`}
                    icon="solar:logout-2-linear"
                  />
                }
                onPress={async () => {
                  await signOut();
                  redirect("/login");
                }}
              >
                Déconnexion
              </DropdownItem>
            </DropdownSection>,
          ]}
        </DropdownMenu>
      </Dropdown>
      <Spacer y={8} />
    </div>
  );
}
