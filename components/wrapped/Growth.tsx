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
import { WrappedSection } from "./components/WrappedSection";
import { SectionHeading } from "./components/SectionHeading";

// Monthly actual downloads (calculated from cumulative data)
const downloadData = [
  { month: "Jan", downloads: 1.38 },
  { month: "Feb", downloads: 1.40 }, // 2.78 - 1.38
  { month: "Mar", downloads: 1.60 }, // 4.38 - 2.78
  { month: "Apr", downloads: 1.60 }, // 5.98 - 4.38
  { month: "May", downloads: 2.00 }, // 7.98 - 5.98
  { month: "Jun", downloads: 2.50 }, // 10.48 - 7.98
  { month: "Jul", downloads: 11.80 }, // 22.28 - 10.48
  { month: "Aug", downloads: 11.90 }, // 34.18 - 22.28
  { month: "Sep", downloads: 14.80 }, // 48.98 - 34.18
  { month: "Oct", downloads: 18.10 }, // 67.08 - 48.98
  { month: "Nov", downloads: 23.10 }, // 90.18 - 67.08
  { month: "Dec", downloads: 24.20 }, // 114.38 - 90.18
];

const formatDownloads = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}M`;
  }
  return `${value.toFixed(1)}M`;
};

export function Growth() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Growth"
        subtitle="Monthly package downloads in 2025"
      />
      <div className="w-full aspect-[21/9] border-b border-l border-r border-border -mt-[1px] bg-card p-6">
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
              formatter={(value: number) => [`${formatDownloads(value)}`, "Downloads"]}
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
      </div>
    </WrappedSection>
  );
}

