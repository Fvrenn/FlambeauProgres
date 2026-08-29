"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, cn } from "@heroui/react";

import { Icon } from "@/lib/icons";
import { BUG_REPORT_NAV_ITEM } from "@/config/navigation";

type BugReportNavLinkProps = {
  isCompact?: boolean;
  onSelect?: () => void;
};

export const BugReportNavLink = ({
  isCompact,
  onSelect,
}: BugReportNavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === BUG_REPORT_NAV_ITEM.href;

  const content = (
    <Link
      className={cn(
        "flex h-11 items-center rounded-large border border-[#E06511]/50 font-medium text-small transition-colors",
        "hover:bg-[#E06511] hover:text-white",
        isActive ? "bg-[#E06511] text-white" : "bg-[#E06511]/10 text-[#E06511]",
        isCompact ? "w-11 justify-center" : "w-full gap-2 px-3",
      )}
      href={BUG_REPORT_NAV_ITEM.href}
      onClick={onSelect}
    >
      <Icon icon={BUG_REPORT_NAV_ITEM.icon} width={24} />
      {!isCompact && <span>{BUG_REPORT_NAV_ITEM.title}</span>}
    </Link>
  );

  if (isCompact) {
    return (
      <Tooltip content={BUG_REPORT_NAV_ITEM.title} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};
