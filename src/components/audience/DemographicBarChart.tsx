"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

export interface DemographicDatum {
  label: string;
  percent: number;
}

interface DemographicBarChartProps {
  data: DemographicDatum[];
  /** Height per row, keeps the chart's aspect ratio sane across 3–5 items. */
  rowHeight?: number;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as DemographicDatum | undefined;
  if (!datum) return null;

  return (
    <div className="rounded-lg border border-line-strong bg-surface-overlay px-3 py-2 shadow-lg">
      <p className="text-base font-bold text-ink">{datum.percent}%</p>
      <p className="text-xs text-ink-muted">{datum.label}</p>
    </div>
  );
}

export function DemographicBarChart({
  data,
  rowHeight = 40,
}: DemographicBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={data.length * rowHeight + 16}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 36, bottom: 4, left: 4 }}
        barCategoryGap={10}
      >
        <XAxis type="number" hide domain={[0, "dataMax + 10"]} />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-ink-muted)", fontSize: 13 }}
        />
        <Tooltip
          content={ChartTooltip}
          cursor={{ fill: "var(--color-surface-overlay)" }}
        />
        <Bar
          dataKey="percent"
          fill="var(--color-accent)"
          radius={[0, 4, 4, 0]}
          barSize={20}
          activeBar={{ fill: "var(--color-accent-2)" }}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="percent"
            position="right"
            formatter={(value) => `${value}%`}
            style={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
