import { useLifestyle } from "../context/LifestyleContext";
import BottomNav from "./BottomNav";
import Toast from "./Toast";

const Layout = ({ children }) => {
  const { user, logout } = useLifestyle();

  return (
    <div className="relative min-h-screen bg-[#0a0c10] flex flex-col overflow-x-hidden">
      <Toast />

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
            <svg
              className="w-4 h-4 text-zinc-400 group-hover:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT: Added pt-24 to push content below the fixed header */}
      <main className="grow w-full max-w-5xl mx-auto px-4 pt-24 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-700">
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
