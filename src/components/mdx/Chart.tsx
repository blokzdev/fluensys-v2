"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = ["#4aa8e8", "#72bf44", "#e8b44a", "#b78ae8", "#e87a7a"];

export interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface ChartProps {
  /** Chart flavour. */
  type?: "line" | "area" | "bar";
  title?: string;
  /** Row data, e.g. [{ flow: 0, head: 52 }, ...] */
  data: Array<Record<string, number | string>>;
  /** Key used for the X axis. */
  x: string;
  xLabel?: string;
  yLabel?: string;
  series: ChartSeries[];
  height?: number;
}

/**
 * Interactive in-article chart used by authoring routines via MDX:
 *
 *   <Chart
 *     type="line"
 *     title="Pump curve at varying speed"
 *     x="flow" xLabel="Flow (m³/h)" yLabel="Head (m)"
 *     data={[{ flow: 0, full: 60, reduced: 38 }, ...]}
 *     series={[{ key: "full", label: "100% speed" }, { key: "reduced", label: "80% speed" }]}
 *   />
 */
export function Chart({
  type = "line",
  title,
  data,
  x,
  xLabel,
  yLabel,
  series,
  height = 360,
}: ChartProps) {
  const axisStyle = { fill: "#6b7a90", fontSize: 12, fontFamily: "var(--font-mono)" };
  const common = {
    data,
    margin: { top: 12, right: 16, bottom: xLabel ? 28 : 8, left: yLabel ? 18 : 4 },
  };

  const xAxis = (
    <XAxis
      dataKey={x}
      tick={axisStyle}
      stroke="#2a3850"
      label={
        xLabel
          ? { value: xLabel, position: "insideBottom", offset: -18, ...axisStyle }
          : undefined
      }
    />
  );
  const yAxis = (
    <YAxis
      tick={axisStyle}
      stroke="#2a3850"
      label={
        yLabel
          ? { value: yLabel, angle: -90, position: "insideLeft", offset: -6, ...axisStyle }
          : undefined
      }
    />
  );
  const grid = <CartesianGrid stroke="#1b2840" strokeDasharray="4 4" />;
  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "#101a2c",
        border: "1px solid rgba(151,170,196,.28)",
        borderRadius: 12,
        color: "#e9eef6",
        fontSize: 13,
      }}
    />
  );
  const legend = <Legend wrapperStyle={{ fontSize: 13, color: "#a3b2c5" }} />;

  let chart: React.ReactElement;
  if (type === "bar") {
    chart = (
      <BarChart {...common}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label ?? s.key}
            fill={s.color ?? PALETTE[i % PALETTE.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    );
  } else if (type === "area") {
    chart = (
      <AreaChart {...common}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        {series.map((s, i) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={s.color ?? PALETTE[i % PALETTE.length]}
            fill={s.color ?? PALETTE[i % PALETTE.length]}
            fillOpacity={0.18}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    );
  } else {
    chart = (
      <LineChart {...common}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={s.color ?? PALETTE[i % PALETTE.length]}
            strokeWidth={2.25}
            dot={false}
            type="monotone"
          />
        ))}
      </LineChart>
    );
  }

  return (
    <figure className="card-surface !my-10 p-4 sm:p-6">
      {title ? <p className="text-eyebrow mb-5">{title}</p> : null}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>{chart}</ResponsiveContainer>
      </div>
    </figure>
  );
}
