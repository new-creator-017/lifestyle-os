import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function MetricBlock({
  title,
  unit,
  dataKey,
  value,
  setValue,
  onAdd,
  isSyncing,
  history,
  target,
}) {
  // Formats "2026-03-23" -> "23 MAR"
  const formatXAxisDate = (tickItem) => {
    if (!tickItem) return "";
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const parts = tickItem.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const month = months[parseInt(parts[1], 10) - 1];
      return `${day} ${month}`;
    }
    return tickItem;
  };

  // Calculates exactly 5 equidistant dates from the current history set
  const xAxisTicks = useMemo(() => {
    if (!history || history.length === 0) return [];
    if (history.length <= 5) return history.map((d) => d.date);

    const ticks = [];
    const step = (history.length - 1) / 4;
    for (let i = 0; i < 5; i++) {
      const index = Math.round(i * step);
      if (history[index]) ticks.push(history[index].date);
    }
    return ticks;
  }, [history]);

  // Safe domain calculation with a 2-unit buffer
  const getDomain = () => {
    return [
      (dataMin) => Math.floor(Math.min(dataMin, target || dataMin) - 2),
      (dataMax) => Math.ceil(Math.max(dataMax, target || dataMax) + 2),
    ];
  };

  return (
    <div className="space-y-2">
      <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em]">
        {title}
      </h2>

      {/* DATA LOGGER */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-12">
          <input
            type="text"
            inputMode="decimal"
            placeholder="00.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-full bg-black/40 px-4 rounded-xl text-lg font-bold text-white outline-none border border-white/5 focus:border-cyan-500/50 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px]">
            {unit}
          </span>
        </div>
        <button
          onClick={onAdd}
          disabled={isSyncing || !value}
          className="h-12 px-6 bg-white text-black font-black rounded-xl uppercase tracking-widest text-xs transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-20"
        >
          {isSyncing ? "..." : "Add"}
        </button>
      </div>

      {/* GRAPH WITH BORDER & AXIS LINES */}
      <div className="w-full border border-white/10 bg-black/20">
        <ResponsiveContainer width="100%" height={240} minWidth={0}>
          <LineChart
            data={history}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              ticks={xAxisTicks} // Forces Recharts to only show our 5 calculated dates
              tickFormatter={formatXAxisDate}
              stroke="#52525b"
              fontSize={9}
              fontWeight="bold"
              axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
              tickLine={{ stroke: "#52525b", strokeWidth: 2 }} // Added the vertical dash
              tickSize={6} // Length of the dash
              dy={10}
            />

            <YAxis
              dataKey={dataKey}
              stroke="#52525b"
              fontSize={10}
              fontWeight="bold"
              axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
              tickLine={false}
              dx={-10}
              domain={getDomain()}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                padding: "12px",
              }}
              labelStyle={{
                color: "#71717a",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#06b6d4",
                textTransform: "uppercase",
                fontSize: "12px",
                fontWeight: "900",
              }}
            />

            {/* SOLID TARGET LINE */}
            {target && (
              <ReferenceLine
                y={target}
                stroke="#06b6d4"
                strokeWidth={2}
                strokeOpacity={0.3}
              />
            )}

            <Line
              connectNulls={true}
              type="monotone"
              dataKey={dataKey}
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#fff", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
