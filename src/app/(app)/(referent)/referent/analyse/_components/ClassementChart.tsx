"use client";

import type { ApexOptions } from "apexcharts";
import type { StatComptee } from "@/lib/analytics";

import React from "react";

import { EmptyChart } from "./EmptyChart";

import ApexChart, { buildBaseOptions } from "@/components/charts/ApexChart";
import { BRAND_GREEN, CHART_FONT, CHART_INK } from "@/lib/chart-theme";

export function ClassementChart({
  data,
  messageVide,
}: {
  data: StatComptee[];
  messageVide?: string;
}) {
  const max = React.useMemo(
    () => Math.max(1, ...data.map((stat) => stat.total)),
    [data],
  );

  const options = React.useMemo<ApexOptions>(() => {
    const base = buildBaseOptions();

    return {
      ...base,
      chart: { ...base.chart, type: "bar" },
      colors: [BRAND_GREEN],
      legend: { ...base.legend, show: false },
      grid: { ...base.grid, show: false },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "45%",
          borderRadius: 4,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        offsetX: 8,
        style: { fontSize: "12px", fontWeight: 700, colors: [CHART_INK] },
        background: { enabled: false },
        formatter: (valeur: number) => String(valeur),
      },
      xaxis: {
        categories: data.map((stat) => stat.label),
        max: max * 1.18,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: CHART_INK,
            fontFamily: CHART_FONT,
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        ...base.tooltip,
        y: { formatter: (valeur: number) => `${valeur} validation(s)` },
      },
    };
  }, [data, max]);

  const series = React.useMemo(
    () => [{ name: "Validations", data: data.map((stat) => stat.total) }],
    [data],
  );

  if (data.length === 0) {
    return <EmptyChart message={messageVide} />;
  }

  return (
    <ApexChart
      height={Math.max(160, data.length * 40 + 40)}
      options={options}
      series={series}
      type="bar"
    />
  );
}
