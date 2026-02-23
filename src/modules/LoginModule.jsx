import { useState } from "react";
import { auth } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // This opens the Google Selection Popup
      await signInWithPopup(auth, provider);
      // NOTE: We don't need to 'redirect' manually.
      // LifestyleContext hears the success and App.jsx swaps the view.
    } catch (error) {
      console.error("Authentication failed:", error);
      setError("ACCESS DENIED. PLEASE RETRY.");
      setLoading(false);
      //   setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
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

      <div className="h-6 flex items-center justify-center mb-2">
        {error && (
          <p className="text-red-500 text-[10px] font-mono tracking-[0.2em] uppercase">
            {error}
          </p>
        )}
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
