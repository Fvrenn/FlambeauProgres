"use client";

import Image from "next/image";
import { Card, CardBody } from "@heroui/react";

import ProgressBar from "./ProgressBar";

import { withAlpha } from "@/lib/color";

type EtapeProgressCardProps = {
  name: string;
  number: string;
  imageSrc: string | null;
  color: string;
  done: number;
  total: number;
};

export default function EtapeProgressCard({
  name,
  number,
  imageSrc,
  color,
  done,
  total,
}: EtapeProgressCardProps) {
  const completed = total > 0 && done >= total;

  let percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  if (completed) {
    percentage = 100;
  } else if (percentage >= 100) {
    percentage = 99;
  } else if (done > 0 && percentage === 0) {
    percentage = 1;
  }

  return (
    <Card
      className="h-full transition-transform duration-300 hover:-translate-y-1"
      shadow="sm"
    >
      <CardBody className="flex flex-col items-center gap-4 p-5 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: withAlpha(color, 0.1),
            boxShadow: `0 0 0 2px ${color}, 0 10px 24px ${withAlpha(color, 0.2)}`,
          }}
        >
          {imageSrc ? (
            <Image
              alt={`Badge étape ${name}`}
              className="h-14 w-14 object-contain"
              height={56}
              src={imageSrc}
              width={56}
            />
          ) : (
            <span className="text-xl font-bold" style={{ color }}>
              {number}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium tracking-wide text-default-400 uppercase">
            Étape {number}
          </span>
          <span className="leading-tight font-semibold text-foreground">
            {name}
          </span>
        </div>

        <ProgressBar
          ariaLabel={`Progression de l'étape ${name}`}
          color={color}
          completed={completed}
          percentage={percentage}
        />

        <span className="text-xs text-default-400">
          {done}/{total} objectifs validés
        </span>
      </CardBody>
    </Card>
  );
}
