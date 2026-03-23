import React from "react";
import { usePhysique } from "../hooks/usePhysique";
import MetricBlock from "../components/MetricBlock";

export default function PhysiqueModule() {
  const {
    weight,
    setWeight,
    waist,
    setWaist,
    stomach,
    setStomach,
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
    <div className="space-y-8 max-w-xl mx-auto pb-6 px-2 animate-in fade-in duration-500">
      {/* HEADER & FULL-WIDTH TIME RANGE SELECTION */}
      <div className="flex flex-col gap-5 mb-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Physique
          </h1>
          <p className="text-zinc-500 text-sm">Log and analyze body metrics.</p>
        </div>

        {/* TIME SELECTION - NOW SPANS FULL WIDTH */}
        <div className="flex w-full gap-1 bg-zinc-900/80 border border-white/5 p-1 rounded-xl">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => setTimeRange(r.value)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${
                timeRange === r.value
                  ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <MetricBlock
        title="Body Weight"
        unit="KG"
        dataKey="weight"
        value={weight}
        setValue={setWeight}
        onAdd={handleLog}
        isSyncing={isSyncing}
        history={history}
        target={targets?.targetWeight}
      />

      <MetricBlock
        title="Waist Circumference"
        unit="IN"
        dataKey="waist"
        value={waist}
        setValue={setWaist}
        onAdd={handleLog}
        isSyncing={isSyncing}
        history={history}
        target={targets?.targetWaist}
      />

      <MetricBlock
        title="Stomach Circumference"
        unit="IN"
        dataKey="stomach"
        value={stomach}
        setValue={setStomach}
        onAdd={handleLog}
        isSyncing={isSyncing}
        history={history}
        target={targets?.targetStomach}
      />
    </div>
  );
}
