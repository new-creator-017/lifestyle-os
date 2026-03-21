import { useLifestyle } from "../context/LifestyleContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function Toast() {
  const { toast } = useLifestyle();

  if (!toast.visible) return null;

  const isSuccess = toast.type === "success";

  return (
    // 1. Added w-[90%] and max-w-md to control the width of the floating container
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md animate-in fade-in slide-in-from-top-5 duration-300">
      {/* 2. Added w-full to make the colored box stretch to the edges of our 90% container */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md w-full ${
          isSuccess
            ? "bg-cyan-950/90 border-cyan-500/50 text-cyan-50"
            : "bg-red-950/90 border-red-500/50 text-red-50"
        }`}
      >
        {/* 3. Added shrink-0 to the icons so they don't get squished if the text is long */}
        {isSuccess ? (
          <CheckCircle size={18} className="text-cyan-400 shrink-0" />
        ) : (
          <XCircle size={18} className="text-red-400 shrink-0" />
        )}

        {/* 4. Added truncate so if a message is ever too long, it adds "..." instead of breaking the layout */}
        <span className="font-mono text-xs uppercase tracking-wider font-bold shadow-sm truncate">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
