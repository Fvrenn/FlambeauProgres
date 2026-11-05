import React from "react";

import { Card, CardBody } from "@/components/ui";

type ChartCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={className ?? "bg-dashboard-panel"}>
      <CardBody className="gap-1">
        <h2 className="text-medium font-bold">{title}</h2>
        <p className="text-tiny text-default-500">{description}</p>
        <div className="mt-3">{children}</div>
      </CardBody>
    </Card>
  );
}
