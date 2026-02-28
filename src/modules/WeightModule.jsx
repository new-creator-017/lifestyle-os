import { useWeight } from "../hooks/useWeight";

export default function WeightModule() {
  const { weight, handleWeightChange, isSyncing, handleLog } = useWeight();

  return (
    <div className="space-y-6">
      {/* Side-by-Side Input & Button */}
      <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl shadow-xl backdrop-blur-sm">
        <label className="block text-zinc-600 font-mono text-[12px] uppercase tracking-[0.3em] mb-2 ml-1">
          Add Weight
        </label>

        <div className="flex gap-2 h-12">
          {" "}
          {/* Height reduced to 12 (48px) */}
          {/* Input Field */}
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="decimal"
              placeholder="00.00"
              value={weight}
              onChange={handleWeightChange}
              className="w-full h-full bg-black/40 px-4 rounded-xl text-lg font-bold text-white outline-none border border-transparent focus:border-cyan-500/30 transition-all placeholder:text-zinc-800"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px] tracking-widest">
              KG
            </span>
          </div>
          {/* Action Button */}
          <button
            onClick={handleLog}
            disabled={!weight || isSyncing}
            className="px-6 h-full bg-white text-black font-black rounded-xl uppercase tracking-widest text-xs transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-10"
          >
            Log
          </button>
        </div>
      </div>
    </div>
  );
}
