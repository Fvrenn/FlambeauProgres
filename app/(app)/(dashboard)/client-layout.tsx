"use client";

import React from "react";
import { Button, ScrollShadow, Spacer } from "@heroui/react";
import Sidebar from "@/components/application/sidebar/sidebar";
import { sectionNestedItems } from "@/components/application/sidebar/sidebar-items";

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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground"></div>
          <span className="text-small font-bold uppercase">Acme</span>
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
          <Sidebar defaultSelectedKey="home" items={sectionNestedItems} />
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