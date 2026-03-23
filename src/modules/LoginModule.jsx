import { useState } from "react";
import { loginWithGoogle } from "../services/authService";
import { useLifestyle } from "../context/LifestyleContext";

export default function LoginModule() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useLifestyle(); // Import the global snackbar function

  const handleLogin = async () => {
    setLoading(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Authentication failed:", error);
      showToast("ACCESS DENIED. PLEASE RETRY.", "error"); // Use global snackbar here
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0c10] flex flex-col items-center justify-center min-h-screen p-6">
      {/* OS Branding */}
      <div className="text-center space-y-6 mb-24">
        <h1 className="text-6xl font-black italic tracking-tighter text-white leading-none">
          LIFESTYLE
          <span className="text-zinc-800 font-normal not-italic">OS</span>
        </h1>

        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-zinc-800" /> {/* Fixed to h-px */}
          <p className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase">
            System Core <span className="text-zinc-300">v1.0</span>
          </p>
          <div className="h-px w-10 bg-zinc-800" /> {/* Fixed to h-px */}
        </div>
      </div>

      {/* Auth Action */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="group relative flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        ) : (
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="G"
            className="w-5 h-5"
          />
        )}
        <span>{loading ? "AUTHENTICATING..." : "CONTINUE WITH GOOGLE"}</span>
      </button>

      <footer className="absolute bottom-10 text-zinc-600 text-[10px] tracking-widest uppercase font-bold">
        Secure Encryption Active
      </footer>
    </div>
  );
}
