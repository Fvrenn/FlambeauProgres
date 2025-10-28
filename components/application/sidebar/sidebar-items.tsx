"use client";
import {Chip} from "@heroui/react";
import {Icon} from "@iconify/react";

import {type SidebarItem, SidebarItemType} from "./sidebar";

export const items: SidebarItem[] = [
  {
    key: "Tableau-de-bord",
    href: "/",
    icon: "solar:home-2-linear",
    title: "Tableau de bord",
  },
  // {
  //   key: "tasks",
  //   href: "#",
  //   icon: "solar:checklist-minimalistic-outline",
  //   title: "Tasks",
  //   endContent: (
  //     <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
  //   ),
  // },
  {
    key: "team",
    href: "#",
    icon: "solar:users-group-two-rounded-outline",
    title: "Team",
  },
  {
    key: "settings",
    href: "#",
    icon: "solar:settings-outline",
    title: "Settings",
  },
];

export const sectionItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "Tableau-de-bord",
        href: "/",
        icon: "solar:home-2-linear",
        title: "Tableau de bord",
      },
      // {
      //   key: "tasks",
      //   href: "#",
      //   icon: "solar:checklist-minimalistic-outline",
      //   title: "Tasks",
      //   endContent: (
      //     <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
      //   ),
      // },
      {
        key: "team",
        href: "#",
        icon: "solar:users-group-two-rounded-outline",
        title: "Team",
      },
    ],
  },
  {
    key: "organization",
    title: "Organization",
    items: [
      {
        key: "cap_table",
        href: "#",
        title: "Cap Table",
        icon: "solar:pie-chart-2-outline",
        items: [
          {
            key: "shareholders",
            href: "#",
            title: "Shareholders",
          },
          {
            key: "note_holders",
            href: "#",
            title: "Note Holders",
          },
          {
            key: "transactions_log",
            href: "#",
            title: "Transactions Log",
          },
        ],
      },
      {
        key: "settings",
        href: "/settings",
        icon: "solar:settings-outline",
        title: "Settings",
      },
    ],
  },
];

export const sectionItemsWithTeams: SidebarItem[] = [
  ...sectionItems,
  {
    key: "your-teams",
    title: "Your Teams",
    items: [
      {
        key: "heroui",
        href: "#",
        title: "HeroUI",
      },
      {
        key: "tailwind-variants",
        href: "#",
        title: "Tailwind Variants",
      },
      {
        key: "heroui-pro",
        href: "#",
        title: "HeroUI Pro",
      },
    ],
  },
];

export const brandItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "Tableau-de-bord",
        href: "/",
        icon: "solar:home-2-linear",
        title: "Tableau de bord",
      },
      // {
      //   key: "tasks",
      //   href: "#",
      //   icon: "solar:checklist-minimalistic-outline",
      //   title: "Tasks",
      //   endContent: (
      //     <Icon
      //       className="text-primary-foreground/60"
      //       icon="solar:add-circle-line-duotone"
      //       width={24}
      //     />
      //   ),
      // },
      {
        key: "team",
        href: "#",
        icon: "solar:users-group-two-rounded-outline",
        title: "Team",
      },
    ],
  },
  {
    key: "your-teams",
    title: "Your Teams",
    items: [
      {
        key: "heroui",
        href: "#",
        title: "HeroUI",
      },
      {
        key: "tailwind-variants",
        href: "#",
        title: "Tailwind Variants",
      },
      {
        key: "heroui-pro",
        href: "#",
        title: "HeroUI Pro",
      },
    ],
  },
];

export const sectionLongList: SidebarItem[] = [
  ...sectionItems,
  {
    key: "payments",
    title: "Payments",
    items: [
      {
        key: "payroll",
        href: "#",
        title: "Payroll",
        icon: "solar:dollar-minimalistic-linear",
      },
      {
        key: "invoices",
        href: "#",
        title: "Invoices",
        icon: "solar:file-text-linear",
      },
      {
        key: "billing",
        href: "#",
        title: "Billing",
        icon: "solar:card-outline",
      },
      {
        key: "payment-methods",
        href: "#",
        title: "Payment Methods",
        icon: "solar:wallet-money-outline",
      },
      {
        key: "payouts",
        href: "#",
        title: "Payouts",
        icon: "solar:card-transfer-outline",
      },
    ],
  },
  {
    key: "your-teams",
    title: "Your Teams",
    items: [
      {
        key: "heroui",
        href: "#",
        title: "HeroUI",
      },
      {
        key: "tailwind-variants",
        href: "#",
        title: "Tailwind Variants",
      },
      {
        key: "heroui-pro",
        href: "#",
        title: "HeroUI Pro",
      },
    ],
  },
];

export const sectionNestedItems: SidebarItem[] = [
  {
    key: "Tableau-de-bord",
    href: "/",
    icon: "solar:home-2-linear",
    title: "Tableau de bord",
  },
  // {
  //   key: "tasks",
  //   href: "#",
  //   icon: "solar:checklist-minimalistic-outline",
  //   title: "Tasks",
  //   endContent: (
  //     <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
  //   ),
  // },
  {
    key: "team",
    href: "#",
    icon: "solar:users-group-two-rounded-outline",
    title: "Team",
  },
  {
    key: "cap_table",
    title: "Cap Table",
    icon: "solar:pie-chart-2-outline",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "shareholders",
        icon: "solar:users-group-rounded-linear",
        href: "#",
        title: "Shareholders",
      },
      {
        key: "note_holders",
        icon: "solar:notes-outline",
        href: "#",
        title: "Note Holders",
      },
      {
        key: "transactions_log",
        icon: "solar:clipboard-list-linear",
        href: "#",
        title: "Transactions Log",
      },
    ],
  },
];
