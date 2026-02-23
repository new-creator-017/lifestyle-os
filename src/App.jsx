import { useLifestyle } from "./context/LifestyleContext";
import LoginModule from "./modules/LoginModule";
import DashboardModule from "./modules/DashboardModule";

export default function App() {
  // Pulling 'user' and 'loading' from your Context
  const { user, loading } = useLifestyle();

  /**
   * 1. THE AUTH GATE
   * While Firebase checks for an existing session (loading === true),
   * we render a blank black screen or a simple spinner.
   * This prevents the "Login Button Flash" for users who are already logged in.
   */
  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  /**
   * 2. THE REDIRECT LOGIC
   * If Firebase found a user, we show the Dashboard.
   * Otherwise, we show the Login screen.
   */
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {user ? <DashboardModule /> : <LoginModule />}
    </div>
  );
}
