"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Spacer,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { signOut } from "@/src/lib/auth-client";
import { redirect } from "next/navigation";

// --- Icônes pour le menu ---

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
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8v5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 11.5h7"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeconnexionIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M12.95 21.99h-3.9c-4 0-5-1-5-5v-8c0-4 1-5 5-5h3.9c4 0 5 1 5 5v1"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.95 12h-6.9M18.95 15l3-3-3-3"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ContextSwitcher({ user }: { user: any }) {
  const pathname = usePathname();

  console.log("Role utilisateur dans ContextSwitcher :", user.role);

  const getCurrentContext = () => {
    if (pathname.startsWith("/admin")) return "Interface Admin";
    if (pathname.startsWith("/referent")) return "Interface Référent";
    return "Mon Progrès (Chef)";
  };

  // Classes communes pour les icônes
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

  return (
    <div className="flex flex-col">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            fullWidth
            className="h-auto justify-between gap-3 rounded-xl border-1 border-divider bg-default-100 p-2"
            endContent={<DropdownIcon />}
          >
            <div className="flex flex-col text-left">
              <p className="text-small font-medium text-foreground">
                {user.name}
              </p>
              <p className="text-tiny text-default-400">
                {getCurrentContext()}
              </p>
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Menu de Contexte"
          variant="faded"
          itemClasses={{
            base: [
              // Applique ces classes à chaque item survolé
              
              "data-[hover=true]:border-divider"
            ],
          }}
        >
          <DropdownSection showDivider title="Changer de vue">
            {/* --- MODIFICATION ICI --- */}
            {!(pathname === "/" || pathname.startsWith("/troupe")) ? (
              <DropdownItem
                key="chef"
                as={Link}
                href="/"
                description="Accéder à votre progression"
                startContent={<DashboardIcon className={iconClasses} />}
              >
                Mon Progrès (Chef)
              </DropdownItem>
            ) : null}

            {user.role === "REFERENT" && !pathname.startsWith("/referent") ? (
              <DropdownItem
                key="referent"
                as={Link}
                href={
                  user.etapesReferent?.length > 0
                    ? `/referent/dashboard?etapeId=${user.etapesReferent[0].id}`
                    : "/referent/dashboard"
                }
                description={
                  user.etapesReferent?.length > 0
                    ? `Gérer l'étape "${user.etapesReferent[0].name}"`
                    : "Gérer les justifications"
                }
                startContent={<DashboardIcon className={iconClasses} />}
              >
                Interface Référent
              </DropdownItem>
            ) : null}

            {user.role === "ADMIN" && !pathname.startsWith("/admin") ? (
              <DropdownItem
                key="admin"
                as={Link}
                href="/admin/dashboard"
                description="Administrer la plateforme"
                startContent={<DashboardIcon className={iconClasses} />}
              >
                Interface Admin
              </DropdownItem>
            ) : null}
          </DropdownSection>

          <DropdownSection title="Compte">
            <DropdownItem
              key="profil"
              as={Link}
              href="/profil"
              startContent={<ProfilIcon className={iconClasses} />}
            >
              Mon Profil
            </DropdownItem>
                        <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={
                <DeconnexionIcon
                  className={`${iconClasses} text-danger`}
                />
              }
              onPress={async () => {
                await signOut();
                redirect("/login");
              }}
            >
              Déconnexion
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <Spacer y={8} />
    </div>
  );
}
