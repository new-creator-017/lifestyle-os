import React, { useState, useMemo } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SleepModule() {
  const [days, setDays] = useState(7);
  const { history, avgDurationLabel, isAsleep, page, setPage, handleAction } =
    useSleep(days);

  // 1. DYNAMIC AXIS: Calculate min/max from current history with 1hr padding
  const yDomain = useMemo(() => {
    if (!history || history.length === 0) return [10, 22]; // Fallback
    const beds = history.map((d) => d.bed).filter((v) => v !== null);
    const wakes = history.map((d) => d.wake).filter((v) => v !== null);

    const min = Math.min(...beds) - 1;
    const max = Math.max(...wakes) + 1;
    return [min, max];
  }, [history]);

  // 2. TIME FORMATTER: Converts Noon-Ruler decimals back to HH:mm
  const formatYTime = (val) => {
    if (val === undefined || val === null) return "";
    const totalHours = (val + 12) % 24;
    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
  };

  if (isAsleep) {
    // ... (Your existing Cradle Mode UI remains the same)
    return null;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-32 px-2 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Circadian
          </h1>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDays(d);
                  setPage(0);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                  days === d
                    ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-zinc-900 text-zinc-500 border border-white/5"
                }`}
              >
                {d}D
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

      {/* CHART CONTAINER */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-[40px] p-4 relative group">
        {/* Pagination Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="p-2 bg-black/50 rounded-full backdrop-blur-md border border-white/10 text-white pointer-events-auto"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className={`p-2 bg-black/50 rounded-full backdrop-blur-md border border-white/10 text-white pointer-events-auto ${page === 0 ? "invisible" : ""}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={history}
            margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff05"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#3f3f46", fontSize: 10, fontWeight: "bold" }}
              formatter={(str) => (str ? str.split("-")[2] : "")}
              dy={10}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={formatYTime}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10, fontWeight: "bold" }}
            />
            {/* Target Settings Lines (Dotted) */}
            <ReferenceLine
              y={12}
              stroke="#06b6d4"
              strokeDasharray="5 5"
              strokeOpacity={0.15}
            />{" "}
            {/* 00:00 Goal */}
            <ReferenceLine
              y={19.5}
              stroke="#ffffff"
              strokeDasharray="5 5"
              strokeOpacity={0.15}
            />{" "}
            {/* 07:30 Goal */}
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
              formatter={(value, name, props) => {
                if (!props?.payload) return [value, name];
                return name === "bed"
                  ? [props.payload.displaySleep, "Slept"]
                  : [props.payload.displayWake, "Woke"];
              }}
            />
            {/* SLEEP LINE (Cyan) */}
            <Line
              type="monotone"
              dataKey="bed"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={{ fill: "#06b6d4", r: 5 }}
              label={{
                position: "top",
                fill: "#06b6d4",
                fontSize: 9,
                fontWeight: "black",
                dy: -10,
                // CRITICAL SAFETY CHECK: entry.index must exist
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
            {/* WAKE LINE (White) */}
            <Line
              type="monotone"
              dataKey="wake"
              stroke="#fff"
              strokeWidth={2}
              dot={{ fill: "#fff", r: 4 }}
              label={{
                position: "bottom",
                fill: "#a1a1aa",
                fontSize: 9,
                fontWeight: "bold",
                dy: 10,
                // CRITICAL SAFETY CHECK: entry.index must exist
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

      <button
        onClick={() => handleAction("sleep")}
        className="w-full py-8 bg-zinc-900/60 border border-white/10 text-zinc-400 font-black rounded-4xl uppercase tracking-[0.4em] text-[10px] hover:text-white transition-all active:scale-95"
      >
        Lights Out
      </button>
    </div>
  );
}
