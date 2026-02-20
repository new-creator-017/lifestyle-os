import { useLifestyle } from "../../context/LifestyleContext";

export default function DashboardModule() {
  const { targetBedtime, isBedtimeReached, notificationsEnabled } =
    useLifestyle();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. URGENT NOTIFICATION BANNER */}
      {notificationsEnabled && isBedtimeReached && (
        <div className="bg-red-900/40 border-2 border-red-500 p-6 rounded-3xl animate-bounce-short shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🚨</span>
            <div>
              <h2 className="text-red-400 font-black uppercase tracking-tighter">
                System Alert: Sleep Overdue
              </h2>
              <p className="text-red-200/80 text-sm">
                It is past {targetBedtime}. Initialize sleep sequence now.
              </p>
            </div>
          </div>
        </div>
      )}

      <header>
        <h1 className="text-3xl font-black tracking-tight text-white">
          DASHBOARD
        </h1>
      </header>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-6 rounded-3xl transition-all border ${
            isBedtimeReached
              ? "bg-gray-800 border-red-500/50"
              : "bg-blue-600 border-transparent"
          }`}
        >
          <h2 className="text-white/80 text-sm font-bold uppercase mb-1">
            Target Bedtime
          </h2>
          <p className="text-4xl font-black text-white">{targetBedtime}</p>
        </div>

        <button
          onClick={async () => {
            const res = await Notification.requestPermission();
            alert("Status: " + res);
          }}
        >
          FORCE PERMISSION TEST
        </button>

        {/* ... other cards */}
      </div>
    </div>
  );
}
