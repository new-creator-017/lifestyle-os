import { useLifestyle } from "./context/LifestyleContext";
import DashboardModule from "./modules/Dashboard/DashboardModule";
import SleepModule from "./modules/Sleep/SleepModule";
import SettingsModule from "./modules/Settings/SettingsModule";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";

function App() {
  const { activeTab, isLoading, status } = useLifestyle();

  // Show a clean loading state while Firebase is connecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-blue-400">
        <div className="text-2xl font-mono animate-pulse tracking-widest">
          INITIALIZING OS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Global Status Notifications */}
      <Toast message={status} />

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {activeTab === "home" && <DashboardModule />}
        {activeTab === "sleep" && <SleepModule />}
        {activeTab === "settings" && <SettingsModule />}
      </main>

      <footer className="p-6 text-center text-gray-600 text-xs">
        LIFESTYLE OS v2.0 • REFRACTORED
      </footer>
    </div>
  );
}

export default App;
