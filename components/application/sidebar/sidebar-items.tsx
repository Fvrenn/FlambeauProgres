"use client";
import {Chip} from "@heroui/react";
import {Icon} from "@iconify/react";

import {type SidebarItem, SidebarItemType} from "./sidebar";

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
  // {
  //   key: "team",
  //   href: "#",
  //   icon: "solar:users-group-two-rounded-outline",
  //   title: "Team",
  // },
  // {
  //   key: "cap_table",
  //   title: "Cap Table",
  //   icon: "solar:pie-chart-2-outline",
  //   type: SidebarItemType.Nest,
  //   items: [
  //     {
  //       key: "shareholders",
  //       href: "#",
  //       title: "Shareholders",
  //     },
  //     {
  //       key: "note_holders",
  //       href: "#",
  //       title: "Note Holders",
  //     },
  //     {
  //       key: "transactions_log",
  //       href: "#",
  //       title: "Transactions Log",
  //     },
  //   ],
  // },
];
