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

  const handleSaveBedtime = async () => {
    await updateSetting("targetBedtime", tempTime);
  };

  const handleNotificationToggle = async () => {
    // Current browser-level permission status
    const permission = Notification.permission;

    // CASE 1: Turning it OFF
    if (notificationsEnabled) {
      await updateSetting("notificationsEnabled", false);
      return;
    }

    // CASE 2: Turning it ON - Permission was already blocked by user in iOS settings
    if (permission === "denied") {
      alert(
        "Notifications are blocked in your phone settings. Please enable them for LifestyleOS manually.",
      );
      return;
    }

    // CASE 3: Turning it ON - Permission is already "granted" (Future toggles)
    if (permission === "granted") {
      await updateSetting("notificationsEnabled", true);
      // Note: You'd also re-sync the push token here if needed
      return;
    }

    // CASE 4: Turning it ON - The "Base Case" (First time/Default)
    if (permission === "default") {
      try {
        const response = await Notification.requestPermission();

        if (response === "granted") {
          // Success! Now we save to DB and (ideally) get the Push Token
          await updateSetting("notificationsEnabled", true);

          // This is where you'll eventually call:
          // await subscribeUserToPush(user.uid);
        } else {
          // User clicked "Don't Allow"
          console.log("User denied the request.");
        }
      } catch (err) {
        console.error("Error during first-time activation:", err);
      }
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
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-3xl flex items-center justify-between transition-all">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              Target Bedtime
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-xl p-3 text-blue-400 font-mono focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveBedtime}
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("Toggle Clicked!"); // Check your console for this!
              handleNotificationToggle();
            }}
            className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none bg-zinc-700"
            style={{
              backgroundColor: notificationsEnabled ? "#22c55e" : "#3f3f46",
            }}
          >
            <span
              className={`${
                notificationsEnabled ? "translate-x-8" : "translate-x-1"
              } inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
