import { useLifestyle } from "../context/LifestyleContext";
import { LogOut } from "lucide-react"; // Replaced the bulky SVG
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  const { user, logout } = useLifestyle();

  return (
    <div className="relative min-h-screen bg-[#0a0c10] flex flex-col overflow-x-hidden">
      {/* 1. FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Profile Pic with Online Indicator */}
            <div className="relative">
              <img
                src={user?.photoURL}
                className="w-9 h-9 rounded-full border border-white/10 object-cover"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-500 border-2 border-[#0a0c10] rounded-full"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-white text-xl font-black tracking-tighter uppercase leading-none">
                {user?.displayName}
              </span>
            </div>
          </div>

          {/* Logout Button */}
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
      {/* Note: The pb-32 here is CORRECT. Since you removed the heavy bottom padding 
          from the individual modules, this layout padding ensures your content doesn't 
          get hidden permanently behind the fixed BottomNav. */}
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
