import { useState, useEffect } from "react";
import { useLifestyle } from "../../context/LifestyleContext";

export default function SettingsModule() {
  const { targetBedtime, notificationsEnabled, updateSetting } = useLifestyle();

  // Local state to hold the "unsaved" time
  const [tempTime, setTempTime] = useState(targetBedtime);

  // Keep local state in sync if the database changes externally
  useEffect(() => {
    setTempTime(targetBedtime);
  }, [targetBedtime]);

  const handleSaveTime = async () => {
    await updateSetting("targetBedtime", tempTime);
    // The "Toast" notification is already handled by our hook's logAction logic,
    // but updateSetting can be tracked similarly.
  };

  const handleNotificationToggle = async () => {
    console.log("Toggle clicked!");

    // 1. Check if the browser even supports it
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    try {
      // 2. Explicitly ask for permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        alert("Permission Granted!");
        updateSetting("notificationsActive", true);
      } else {
        alert("Permission status: " + permission);
      }
    } catch (error) {
      alert("Error requesting permission: " + error.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white">
          SETTINGS
        </h1>
      </header>

      <div className="space-y-4">
        {/* BEDTIME WITH SAVE BUTTON */}
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Target Bedtime</h3>
              <p className="text-sm text-gray-500">
                Adjust the wheel and click save.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={tempTime || "23:00"}
                onChange={(e) => setTempTime(e.target.value)}
                className="bg-gray-900 border border-gray-600 rounded-xl p-3 text-blue-400 font-mono focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveTime}
                disabled={tempTime === targetBedtime}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  tempTime === targetBedtime
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                }`}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS TOGGLE */}
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-3xl flex items-center justify-between transition-all">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              Push Notifications
              {notificationsEnabled && (
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {notificationsEnabled
                ? "OS is authorized to send alerts."
                : "Alerts are currently silenced."}
            </p>
          </div>

          <button
            onClick={() =>
              updateSetting("notificationsActive", !notificationsEnabled)
            }
            className={`w-16 h-8 rounded-full transition-all duration-300 relative shadow-inner ${
              notificationsEnabled ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {/* The sliding "Knob" */}
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                notificationsEnabled ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
