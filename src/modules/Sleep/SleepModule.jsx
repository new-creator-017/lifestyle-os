import { useState } from "react";
import { useLifestyle } from "../../context/LifestyleContext";

export default function SleepModule() {
  const { targetBedtime, logAction } = useLifestyle();
  const [quality, setQuality] = useState(3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white">SLEEP</h1>
        <p className="text-gray-400">
          Target Bedtime:{" "}
          <span className="text-blue-400 font-mono">{targetBedtime}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LOG SLEEP CARD */}
        <button
          onClick={() => logAction("sleep", { target: targetBedtime })}
          className="group relative overflow-hidden bg-indigo-600 p-8 rounded-3xl transition-all hover:bg-indigo-500 active:scale-95 text-left shadow-xl"
        >
          <div className="relative z-10">
            <span className="text-4xl block mb-4">🌙</span>
            <h2 className="text-2xl font-bold mb-1">Log Sleep</h2>
            <p className="text-indigo-200 text-sm">
              Recording start of rest period
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">
            🌙
          </div>
        </button>

        {/* LOG WAKE CARD */}
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Log Wake</h2>
            <span className="text-3xl">☀️</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-gray-400 text-xs uppercase font-black tracking-widest">
                Quality: {quality}/5
              </label>
              <span className="text-orange-400 font-bold">
                {quality === 5 ? "Excellent" : quality === 1 ? "Poor" : "Good"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <button
            onClick={() => logAction("wake", { quality })}
            className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-orange-900/20"
          >
            Wake Up & Sync
          </button>
        </div>
      </div>
    </div>
  );
}
