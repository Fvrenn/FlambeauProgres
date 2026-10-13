import { cn } from "@heroui/react";

import { Card, CardBody } from "./card";

import { clickable } from "@/lib/a11y";
import { Icon } from "@/lib/icons";

type StatTone = "default" | "warning" | "success";

const TONE_STYLES: Record<StatTone, string> = {
  default: "bg-dashboard-card text-nav-active",
  warning: "bg-warning/15 text-warning-700",
  success: "bg-success/15 text-success-700",
};

type StatCardProps = {
  icon: string;
  label: string;
  value: number;
  tone?: StatTone;
  hint?: string;
  onSelect?: () => void;
};

export function StatCard({
  icon,
  label,
  value,
  tone = "default",
  hint,
  onSelect,
}: StatCardProps) {
  const interaction = onSelect
    ? { isPressable: true, ...clickable(onSelect) }
    : {};

  return (
    <Card className="bg-dashboard-panel" {...interaction}>
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
          {hint && (
            <span className="text-tiny text-default-400 mt-1">{hint}</span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
