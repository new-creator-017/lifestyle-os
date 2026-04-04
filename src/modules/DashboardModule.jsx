import { Moon } from "lucide-react";
import { useSleep } from "../hooks/useSleep";

const DashboardModule = () => {
  const { handleAction, isAsleep } = useSleep();

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-6 px-2 animate-in fade-in duration-500">
      <div className="flex flex-col gap-5 mb-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Dashboard
          </h1>
        </div>
      </div>

      <button
        onClick={() => handleAction("sleep")}
        disabled={isAsleep}
        className="w-full flex items-center justify-center gap-3 py-4 bg-cyan-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
      >
        <Moon size={24} /> Lights Out
      </button>
    </div>
  );
};

export default DashboardModule;
