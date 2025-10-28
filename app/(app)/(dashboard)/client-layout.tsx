"use client";

import React from "react";
import { Button, ScrollShadow, Spacer } from "@heroui/react";
import Sidebar from "@/components/application/sidebar/sidebar";
import { sectionNestedItems } from "@/components/application/sidebar/sidebar-items";
import Image from "next/image";

type User = {
  name: string | null;
};

export default function DashboardClientLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return (
    <div className="h-screen min-h-[48rem] flex">
      <div className="relative flex h-full w-72 flex-col border-r-small border-divider p-6">
        <div className="flex items-center gap-2 px-2">
            <Image
              src="/logo/logo-flambeau-progres.svg"
              alt="Flambeau Progrès Logo"
              width={50}
              height={67}
              className="rounded-full"
            />
          <span className="text-2xl font-medium text-[#E06511] leading-7">
            Flambeau <span className="text-[#542C11]">Progrès</span>
          </span>
        </div>

        <Spacer y={8} />

        <div className="flex items-center gap-3 px-2">
          <div className="flex flex-col">
            <p className="text-small font-medium text-default-600">
              {user.name}
            </p>
            <p className="text-tiny text-default-400">Customer Support</p>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar defaultSelectedKey="Tableau-de-bord" items={sectionNestedItems} />
        </ScrollShadow>

        <Spacer y={8} />

        <div className="mt-auto flex flex-col">
          <Button
            fullWidth
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            variant="light"
          >
            Help & Information
          </Button>
          <Button
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            variant="light"
          >
            Log Out
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
