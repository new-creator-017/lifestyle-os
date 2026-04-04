import { useLifestyle } from "../context/LifestyleContext";
import { LogOut, Moon, Sun } from "lucide-react";
import BottomNav from "./BottomNav";
import { useSleep } from "../hooks/useSleep";

const Layout = ({ children }) => {
  const { user, logout } = useLifestyle();
  const { isAsleep, handleAction } = useSleep();

  return (
    <div className="relative min-h-screen bg-[#0a0c10] flex flex-col overflow-x-hidden">
      {/* IMMERSIVE LOCKDOWN OVERLAY */}
      {isAsleep && (
        <div className="fixed inset-0 z-100 bg-[#0a0c10]/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-700">
          <Moon className="text-zinc-600 mb-8" size={32} />
          <h2 className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-16">
            Sleep Session Active
          </h2>

          <button
            onClick={() => handleAction("wake")}
            className="relative flex items-center justify-center w-48 h-48 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all group outline-none"
          >
            {/* Pulsating Ring */}
            <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500/20 opacity-75 [animation-duration:3s]"></div>

            <div className="flex flex-col items-center z-10 group-active:scale-95 transition-transform gap-2">
              <Sun size={24} className="text-cyan-400" />
              <span className="font-black text-xl uppercase tracking-widest">
                Sunshine
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 1. FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.photoURL}
                className="w-9 h-9 rounded-full border border-white/10 object-cover"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-500 border-2 border-[#0a0c10] rounded-full"></div>
            </div>
            <span className="text-white text-xl font-black tracking-tighter uppercase leading-none">
              {user?.displayName}
            </span>
          </div>

          <button
            onClick={logout}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-90"
          >
            <span className="hidden sm:block text-[9px] font-mono text-zinc-500 group-hover:text-red-500 uppercase tracking-widest">
              Logout
            </span>
            <LogOut
              size={16}
              className="text-zinc-400 group-hover:text-red-500"
            />
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="grow w-full max-w-5xl mx-auto px-4 pt-24 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>

      {/* 3. FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
