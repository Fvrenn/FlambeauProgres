import React from "react";
import Link from "next/link";
import { cn } from "@heroui/react";

import { Icon } from "@/lib/icons";
import { prisma } from "@/lib/prisma";
import { roleColorMap } from "@/lib/roles";
import { Badge, Card, CardBody } from "@/components/ui";

const quickLinks = [
  {
    href: "/admin/users",
    icon: "solar:user-linear",
    title: "Utilisateurs",
    description: "Gérer les comptes et les rôles",
  },
  {
    href: "/admin/etapes",
    icon: "solar:flag-linear",
    title: "Étapes",
    description: "Configurer les étapes et leurs objectifs",
  },
  {
    href: "/admin/assignations",
    icon: "solar:link-linear",
    title: "Assignations",
    description: "Associer des référents aux étapes",
  },
  {
    href: "/admin/formations",
    icon: "solar:book-bookmark-linear",
    title: "Formation",
    description: "Gérer les ressources pédagogiques",
  },
];

type StatTone = "default" | "warning" | "success";

const TONE_STYLES: Record<StatTone, string> = {
  default: "bg-dashboard-card text-nav-active",
  warning: "bg-warning/15 text-warning-700",
  success: "bg-success/15 text-success-700",
};

function StatCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: string;
  label: string;
  value: number;
  tone?: StatTone;
}) {
  return (
    <Card className="bg-dashboard-panel">
      <CardBody className="gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-full",
            TONE_STYLES[tone],
          )}
        >
          <Icon icon={icon} width={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold leading-none">{value}</span>
          <span className="text-small text-default-500 mt-1">{label}</span>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const [
    chefCount,
    referentCount,
    adminCount,
    etapesCount,
    objectifsCount,
    formationsCount,
    etapesSansReferent,
    justificationsEnAttente,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CHEF" } }),
    prisma.user.count({ where: { role: "REFERENT" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.etape.count(),
    prisma.objectif.count(),
    prisma.formationCard.count(),
    prisma.etape.count({ where: { referents: { none: {} } } }),
    prisma.justification.count({ where: { statut: "SOUMISE" } }),
  ]);

  const totalUsers = chefCount + referentCount + adminCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Tableau de bord admin</h1>
        <p className="text-default-500">
          Vue d&apos;ensemble de la plateforme Flambeau Progrès.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-dashboard-panel">
          <CardBody className="gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-dashboard-card text-nav-active">
              <Icon icon="solar:users-group-rounded-linear" width={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold leading-none">
                {totalUsers}
              </span>
              <span className="text-small text-default-500 mt-1">
                Utilisateurs
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge color={roleColorMap.CHEF} size="sm">
                {chefCount} Chefs
              </Badge>
              <Badge color={roleColorMap.REFERENT} size="sm">
                {referentCount} Référents
              </Badge>
              <Badge color={roleColorMap.ADMIN} size="sm">
                {adminCount} Admins
              </Badge>
            </div>
          </CardBody>
        </Card>

        <StatCard icon="solar:flag-linear" label="Étapes" value={etapesCount} />
        <StatCard
          icon="solar:target-linear"
          label="Objectifs"
          value={objectifsCount}
        />
        <StatCard
          icon="solar:book-bookmark-linear"
          label="Formations"
          value={formationsCount}
        />
        <StatCard
          icon="solar:user-cross-rounded-linear"
          label="Étapes sans référent"
          tone={etapesSansReferent > 0 ? "warning" : "success"}
          value={etapesSansReferent}
        />
        <StatCard
          icon="solar:clock-circle-linear"
          label="Justifications en attente"
          tone={justificationsEnAttente > 0 ? "warning" : "success"}
          value={justificationsEnAttente}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              className="group flex flex-col gap-4 rounded-[22px] bg-dashboard-panel shadow-inset-border p-5 transition-all duration-fast hover:-translate-y-0.5"
              href={item.href}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dashboard-card text-nav-active">
                  <Icon icon={item.icon} width={20} />
                </div>
                <Icon
                  className="text-default-400 group-hover:text-nav-active group-hover:translate-x-0.5 transition-all"
                  icon="solar:arrow-right-up-linear"
                  width={18}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">{item.title}</span>
                <span className="text-tiny text-default-500">
                  {item.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
