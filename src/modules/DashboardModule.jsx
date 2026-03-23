import React, { useState } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import UserProfileCard from "../components/UserProfileCard";
import { runSleepSeed } from "../utils/seedSleep";
import { runPhysiqueSeed } from "../utils/seedPhysique";
import { Database } from "lucide-react";

const DashboardModule = () => {
  const { user, showToast } = useLifestyle();
  const [isSeeding, setIsSeeding] = useState(false);

  // Handle the data injection
  const handleSeed = async () => {
    if (!user?.uid) return;
    setIsSeeding(true);
    try {
      await runSleepSeed(user.uid);
      showToast("System: 14-day sleep data injected.", "success");
    } catch (err) {
      showToast("System: Seeding failed.", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedPhysique = async () => {
    if (!user?.uid) return;
    setIsSeeding(true);
    try {
      await runPhysiqueSeed(user.uid);
      showToast("System: 1 Year Physique history injected.", "success");
    } catch (err) {
      showToast("Physique Seeding failed.", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-24">
        {/* TOP SECTION: The Rounded Profile Card */}
        <header>
          <UserProfileCard />
        </header>

        {/* BOTTOM SECTION: The Goals Workspace */}
        <main className="grid grid-cols-1 gap-8">
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
              Core Objectives
            </h3>

            <div className="text-slate-500 italic text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              Waiting for objective input...
            </div>
          </section>

          {/* SYSTEM UTILITIES SECTION */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 ml-1">
              System Utilities
            </h4>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-800/50 border border-white/5 rounded-2xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <Database
                size={14}
                className={isSeeding ? "animate-pulse" : ""}
              />
              {isSeeding ? "Injecting Data..." : "Seed Sleep History"}
            </button>
            <button
              onClick={handleSeedPhysique}
              disabled={isSeeding}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-800/50 border border-white/5 rounded-2xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <Database size={14} />
              {isSeeding ? "Generating..." : "Seed 1Y Physique"}
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardModule;
