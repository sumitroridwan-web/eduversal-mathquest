"use client";

import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const COLORS = {
  navy: "#1b2540",
  navyLight: "#4a628f",
  teal: "#199473",
  tealLight: "#65d6ad",
  accent: "#f59e0b",
  accentLight: "#ffc94d",
  grid: "#eef1f6",
  axis: "#98a8c6",
};

const axisProps = {
  tick: { fontSize: 12, fill: COLORS.axis },
  tickLine: false,
  axisLine: { stroke: COLORS.grid },
};

function ChartFrame({ height = 260, children }: { height?: number; children: React.ReactElement }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

export function AreaTrend({
  data, xKey, series, height,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; label: string; color?: keyof typeof COLORS }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS[s.color ?? "teal"]} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS[s.color ?? "teal"]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={COLORS[s.color ?? "teal"]}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ChartFrame>
  );
}

export function BarSeries({
  data, xKey, bars, height, layout = "horizontal",
}: {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; label: string; color?: keyof typeof COLORS }[];
  height?: number;
  layout?: "horizontal" | "vertical";
}) {
  const vertical = layout === "vertical";
  return (
    <ChartFrame height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, left: vertical ? 8 : -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={vertical} horizontal={!vertical} />
        {vertical ? (
          <>
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey={xKey} {...axisProps} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} width={40} />
          </>
        )}
        <Tooltip cursor={{ fill: "rgba(15,23,41,0.04)" }} />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={COLORS[b.color ?? "teal"]} radius={vertical ? [0, 6, 6, 0] : [6, 6, 0, 0]} maxBarSize={vertical ? 22 : 44} />
        ))}
      </BarChart>
    </ChartFrame>
  );
}

export function LineTrend({
  data, xKey, series, height,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; label: string; color?: keyof typeof COLORS }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={COLORS[s.color ?? "teal"]} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ChartFrame>
  );
}

export function DonutChart({
  data, height = 240,
}: {
  data: { role: string; count: number; fill: string }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="role" innerRadius="58%" outerRadius="82%" paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.role} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ChartFrame>
  );
}

export function MasteryRadar({
  data, height = 260,
}: {
  data: { strand: string; mastery: number }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={COLORS.grid} />
        <PolarAngleAxis dataKey="strand" tick={{ fontSize: 11, fill: COLORS.axis }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="mastery" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.35} />
        <Tooltip />
      </RadarChart>
    </ChartFrame>
  );
}

export function ProgressGauge({ value, label, height = 200 }: { value: number; label?: string; height?: number }) {
  const data = [{ name: label ?? "Progress", value, fill: COLORS.teal }];
  return (
    <ChartFrame height={height}>
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
        <RadialBar background dataKey="value" cornerRadius={12} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-navy-900 font-display text-2xl font-bold">
          {value}%
        </text>
      </RadialBarChart>
    </ChartFrame>
  );
}
