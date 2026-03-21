import { NavLink } from "react-router-dom";
import { APP_MODULES } from "../modules/moduleConfig";

const BottomNav = () => {
  return (
    /* FIXED: Added fixed positioning and z-index to ensure it stays on top */
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#0d0f14]/95 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="max-w-5xl mx-auto flex justify-around items-stretch">
        {APP_MODULES.map((item) => {
          // FIX 1: Assign the icon to a Capitalized variable to use as a Component
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center flex-1 py-3 transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-black shadow-[0_-4px_20px_rgba(255,255,255,0.1)]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                }
              `}
            >
              {/* FIX 2: Check for isActive outside of a naked function child */}
              {({ isActive }) => (
                <>
                  {/* Indicator Line */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                  )}

                  {/* Icon rendered as a tag */}
                  <span className="text-xl">
                    <Icon weight={isActive ? "fill" : "regular"} />
                  </span>

                  {/* Label: Smaller and tightly tracked */}
                  <span className="text-[8px] font-black font-mono uppercase tracking-[0.15em] mt-1">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
