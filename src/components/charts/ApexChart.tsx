"use client";

import type { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";

import {
  CHART_FONT,
  CHART_GRID,
  CHART_INK,
  CHART_MUTED,
} from "@/lib/chart-theme";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export type ApexChartType = "bar" | "line" | "area" | "heatmap";

type ApexChartProps = {
  type: ApexChartType;
  series: ApexOptions["series"];
  options: ApexOptions;
  height: number;
};

export function buildBaseOptions(): ApexOptions {
  return {
    chart: {
      fontFamily: CHART_FONT,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      parentHeightOffset: 0,
    },
    grid: {
      borderColor: CHART_GRID,
      strokeDashArray: 0,
      padding: { top: 0, right: 8, bottom: 0, left: 8 },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      style: { fontFamily: CHART_FONT, fontSize: "12px" },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: CHART_FONT,
      fontSize: "12px",
      markers: { size: 6, shape: "circle" },
      itemMargin: { horizontal: 10, vertical: 4 },
      labels: { colors: CHART_INK },
    },
    xaxis: {
      axisBorder: { color: CHART_GRID },
      axisTicks: { color: CHART_GRID },
      labels: {
        style: {
          colors: CHART_MUTED,
          fontFamily: CHART_FONT,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: CHART_MUTED,
          fontFamily: CHART_FONT,
          fontSize: "12px",
        },
      },
    },
    states: {
      hover: { filter: { type: "lighten" } },
      active: { filter: { type: "none" } },
    },
  };
}

export default function ApexChart({
  type,
  series,
  options,
  height,
}: ApexChartProps) {
  return (
    <div style={{ minHeight: height }}>
      <ReactApexChart
        height={height}
        options={options}
        series={series}
        type={type}
      />
    </div>
  );
}
