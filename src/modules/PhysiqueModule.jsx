import { usePhysique } from "../hooks/usePhysique";
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

export default function PhysiqueModule() {
  const {
    weight,
    waist,
    setWeight,
    setWaist,
    isSyncing,
    handleLog,
    history,
    targets,
    timeRange,
    setTimeRange,
  } = usePhysique();

  const ranges = [
    { label: "1M", value: 30 },
    { label: "3M", value: 90 },
    { label: "6M", value: 180 },
    { label: "1Y", value: 365 },
    { label: "ALL", value: "ALL" },
  ];

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* 1. DATA ENTRY SECTION */}
      <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-6">
        <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Data Logger
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-2 ml-1">
              Waist
            </label>
            <div className="relative h-12">
              <input
                type="text"
                inputMode="decimal"
                placeholder="00.00"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full h-full bg-black/40 px-4 rounded-xl text-lg font-bold text-white outline-none border border-white/5 focus:border-cyan-500/50 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px]">
                IN
              </span>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-2 ml-1">
              Weight
            </label>
            <div className="relative h-12">
              <input
                type="text"
                inputMode="decimal"
                placeholder="00.00"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-full bg-black/40 px-4 rounded-xl text-lg font-bold text-white outline-none border border-white/5 focus:border-white/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px]">
                KG
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLog}
          disabled={isSyncing || (!weight && !waist)}
          className="w-full h-12 bg-white text-black font-black rounded-xl uppercase tracking-widest text-xs transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-20"
        >
          {isSyncing ? "Syncing..." : "Add"}
        </button>
      </div>

      {/* 2. PROGRESS GRAPHS SECTION */}
      <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em]">
            Progress Tracking
          </h2>
          <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
            {ranges.map((r) => (
              <button
                key={r.label}
                onClick={() => setTimeRange(r.value)}
                className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                  timeRange === r.value
                    ? "bg-cyan-500 text-black"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* WAIST CHART (Primary Metric) */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-sm">
            Waist Circumference (IN)
          </h3>
          <div className="w-full -ml-4">
            <ResponsiveContainer width="100%" height={200} minWidth={0}>
              <LineChart data={history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#52525b"
                  fontSize={10}
                  tickFormatter={(tick) => tick.slice(5)}
                />
                <YAxis
                  dataKey="waist"
                  stroke="#52525b"
                  fontSize={10}
                  domain={[
                    (dataMin) =>
                      Math.floor(
                        Math.min(dataMin, targets.waist || dataMin) - 2,
                      ),
                    (dataMax) =>
                      Math.ceil(
                        Math.max(dataMax, targets.waist || dataMax) + 2,
                      ),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                {targets.waist && (
                  <ReferenceLine
                    y={targets.waist}
                    stroke="#06b6d4"
                    strokeDasharray="3 3"
                  />
                )}
                <Line
                  connectNulls={true}
                  type="monotone"
                  dataKey="waist"
                  stroke="#fff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WEIGHT CHART (Secondary Metric) */}
        <div className="space-y-2 border-t border-white/5 pt-6">
          <h3 className="text-zinc-400 font-bold text-sm">Body Weight (KG)</h3>
          <div className="w-full -ml-4">
            <ResponsiveContainer width="100%" height={200} minWidth={0}>
              <LineChart data={history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#52525b"
                  fontSize={10}
                  tickFormatter={(tick) => tick.slice(5)}
                />
                <YAxis
                  dataKey="weight"
                  stroke="#52525b"
                  fontSize={10}
                  domain={[
                    (dataMin) =>
                      Math.floor(
                        Math.min(dataMin, targets.weight || dataMin) - 5,
                      ),
                    (dataMax) =>
                      Math.ceil(
                        Math.max(dataMax, targets.weight || dataMax) + 5,
                      ),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                {targets.weight && (
                  <ReferenceLine
                    y={targets.weight}
                    stroke="#a1a1aa"
                    strokeDasharray="3 3"
                  />
                )}
                <Line
                  connectNulls={true}
                  type="monotone"
                  dataKey="weight"
                  stroke="#71717a"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#a1a1aa", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
