"use client";

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Monthly actual downloads (calculated from cumulative data)
const downloadData = [
  { month: "Jan", downloads: 1.38 },
  { month: "Feb", downloads: 1.40 },
  { month: "Mar", downloads: 1.60 },
  { month: "Apr", downloads: 1.60 },
  { month: "May", downloads: 2.00 },
  { month: "Jun", downloads: 2.50 },
  { month: "Jul", downloads: 11.80 },
  { month: "Aug", downloads: 11.90 },
  { month: "Sep", downloads: 14.80 },
  { month: "Oct", downloads: 18.10 },
  { month: "Nov", downloads: 23.10 },
  { month: "Dec", downloads: 24.20 },
];

// Relative growth data
const growthData = [
  { month: "Jan", growth: 6.15 },
  { month: "Feb", growth: 6.24 },
  { month: "Mar", growth: 9.40 },
  { month: "Apr", growth: 13.25 },
  { month: "May", growth: 15.66 },
  { month: "Jun", growth: 19.28 },
  { month: "Jul", growth: 30.12 },
  { month: "Aug", growth: 39.76 },
  { month: "Sep", growth: 57.83 },
  { month: "Oct", growth: 63.86 },
  { month: "Nov", growth: 86.75 },
  { month: "Dec", growth: 100.00 },
];

const formatDownloads = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}M`;
  }
  return `${value.toFixed(1)}M`;
};

const formatGrowth = (value: number) => {
  return `${Math.round(value)}%`;
};

export function ConsumptionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={growthData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "currentColor" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            padding: "0.5rem",
          }}
          formatter={(value: number) => [
            `${formatGrowth(value)}`,
            "Traffic relative to Dec 25",
          ]}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar
          dataKey="growth"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="growth"
            position="inside"
            formatter={formatGrowth}
            fill="hsl(var(--card))"
            style={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DownloadsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={downloadData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "currentColor" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            padding: "0.5rem",
          }}
          formatter={(value: number) => [
            `${formatDownloads(value)}`,
            "Downloads",
          ]}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar
          dataKey="downloads"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="downloads"
            position="inside"
            formatter={formatDownloads}
            fill="hsl(var(--card))"
            style={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
