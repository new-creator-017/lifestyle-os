import { useState, useMemo } from "react";
import { useSleep } from "../hooks/useSleep";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

export default function SleepModule() {
  const [days, setDays] = useState(13); // Default changed to 15
  const { history, avgDurationLabel, targets } = useSleep(days);

  // Updated to 15D, 1M, and 3M
  const ranges = [
    { label: "14D", value: 13 },
    { label: "1M", value: 30 },
    { label: "3M", value: 90 },
  ];

  // 1. DYNAMIC Y-AXIS (Rounded to nearest whole hours)
  const yDomain = useMemo(() => {
    if (!history || history.length === 0) return [10, 22];
    const beds = history.map((d) => d.bed).filter((v) => v !== null);
    const wakes = history.map((d) => d.wake).filter((v) => v !== null);

    // We add targets.bed and targets.wake into the Min/Max calculation
    // so the graph always stretches far enough to keep your goals visible!
    const min = Math.floor(Math.min(...beds, targets.bed));
    const max = Math.ceil(Math.max(...wakes, targets.wake));

    return [min, max];
  }, [history, targets]);

  // Generate perfect integer ticks to prevent Recharts from using weird fractions
  const yAxisTicks = useMemo(() => {
    const [min, max] = yDomain;
    const ticks = [];
    const span = max - min;

    // If the graph spans more than 10 hours, step by 2 hours so text isn't crowded.
    // Otherwise, step by 1 hour.
    const step = span > 10 ? 2 : 1;

    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [yDomain]);

  // 2. EQUIDISTANT X-AXIS TICKS (Identical to MetricBlock)
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

  const formatYTime = (val) => {
    if (val === undefined || val === null) return "";

    // Simply modulo 24 to convert Noon-Ruler decimals back to 24hr time!
    // e.g., 31.0 % 24 = 7.0 (07:00 AM)
    const totalHours = val % 24;

    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);

    // padStart ensures minutes like "0" become "00" safely
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-6 px-2 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Circadian
          </h1>
          <div className="flex gap-2">
            {ranges.map((d) => (
              <button
                key={d.label}
                onClick={() => setDays(d.value)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                  days === d.value
                    ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-zinc-900 text-zinc-500 border border-white/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="block text-cyan-500 font-black text-3xl">
            {avgDurationLabel}
          </span>
          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
            Avg Duration
          </span>
        </div>
      </header>

      <div className="w-full border border-white/10 p-1 bg-black/20">
        <ResponsiveContainer width="100%" height={400} minWidth={0}>
          <LineChart
            data={history}
            margin={{ top: 0, right: 0, left: -15, bottom: -5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              ticks={xAxisTicks} // Forces exactly 5 dates
              interval="preserveStartEnd" // Guarantees the first and last dates align perfectly with the graph edges
              tickFormatter={formatXAxisDate}
              stroke="#52525b"
              fontSize={9}
              fontWeight="bold"
              axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
              tickLine={{ stroke: "#52525b", strokeWidth: 2 }} // Added vertical dash
              tickSize={6} // Dash length
              dy={10}
            />

            <YAxis
              domain={yDomain}
              ticks={yAxisTicks}
              tickFormatter={formatYTime}
              stroke="#52525b"
              fontSize={10}
              fontWeight="bold"
              axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
              tickLine={false}
              dx={-10}
            />

            {/* DYNAMIC SETTINGS LINES */}
            <ReferenceLine
              y={targets.bed}
              stroke="#06b6d4"
              strokeWidth={1}
              strokeOpacity={0.5}
            />

            <ReferenceLine
              y={targets.wake}
              stroke="#ffffff"
              strokeWidth={1}
              strokeOpacity={0.5}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
              itemStyle={{
                fontSize: "10px",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              labelStyle={{
                color: "#71717a",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
              formatter={(value, name, props) => {
                if (!props?.payload) return [value, name];
                return name === "bed"
                  ? [props.payload.displaySleep, "Slept"]
                  : [props.payload.displayWake, "Woke"];
              }}
            />

            <Line
              type="monotone"
              dataKey="bed"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 0 }}
              label={{
                position: "top",
                fill: "#06b6d4",
                fontSize: 9,
                fontWeight: "black",
                dy: -10,
                formatter: (v, entry) => {
                  if (
                    entry &&
                    typeof entry.index !== "undefined" &&
                    history[entry.index]
                  ) {
                    return history[entry.index].displaySleep;
                  }
                  return "";
                },
              }}
            />

            <Line
              type="monotone"
              dataKey="wake"
              stroke="#fff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#fff", strokeWidth: 0 }}
              label={{
                position: "bottom",
                fill: "#a1a1aa",
                fontSize: 9,
                fontWeight: "bold",
                dy: 10,
                formatter: (v, entry) => {
                  if (
                    entry &&
                    typeof entry.index !== "undefined" &&
                    history[entry.index]
                  ) {
                    return history[entry.index].displayWake;
                  }
                  return "";
                },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
