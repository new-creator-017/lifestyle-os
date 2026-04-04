import { useState, useEffect, useCallback } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import { getSleepHistory, logSleepSession } from "../services/sleepService";
import { getUserSettings } from "../services/settingsService"; // Import settings

// Helper to convert "23:30" or "07:00" to the graph's decimal format
const parseTargetTime = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  let decimal = hours + minutes / 60;
  if (decimal < 12) decimal += 24; // Push morning times past midnight
  return parseFloat(decimal.toFixed(2));
};

export function useSleep(days = 14) {
  const { user } = useLifestyle();
  const [history, setHistory] = useState([]);
  const [avgDurationLabel, setAvgDurationLabel] = useState("0h 00m");
  const [isAsleep, setIsAsleep] = useState(false);

  // Default fallback targets just in case settings are empty
  const [targets, setTargets] = useState({ bed: 23.5, wake: 31.0 });

  // === NEW GLOBAL SYNC LOGIC ===
  // This ensures Layout.jsx and DashboardModule.jsx always share the exact same state
  useEffect(() => {
    const syncSleepState = () => {
      const session = localStorage.getItem("lifestyle_sleep_start");
      setIsAsleep(!!session);
    };

    syncSleepState(); // Check on mount
    window.addEventListener("sleep_status_changed", syncSleepState); // Listen for cross-component triggers

    return () => {
      window.removeEventListener("sleep_status_changed", syncSleepState); // Cleanup
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.uid) return;

    try {
      // Fetch both history and settings simultaneously
      const [data, settings] = await Promise.all([
        getSleepHistory(user.uid, days),
        getUserSettings(user.uid),
      ]);

      setHistory(data);

      // Parse user's custom targets if they exist
      if (settings?.targetBedtime && settings?.targetWakeTime) {
        setTargets({
          bed: parseTargetTime(settings.targetBedtime),
          wake: parseTargetTime(settings.targetWakeTime),
        });
      }

      // Calculate Average Duration
      if (data && data.length > 0) {
        const validEntries = data.filter((d) => d.duration > 0);
        if (validEntries.length > 0) {
          const totalHours = validEntries.reduce(
            (sum, entry) => sum + entry.duration,
            0,
          );
          const avgHours = totalHours / validEntries.length;

          let h = Math.floor(avgHours);
          let m = Math.round((avgHours - h) * 60);

          // EDGE CASE FIX: Prevent "7h 60m" display
          if (m === 60) {
            h += 1;
            m = 0;
          }

          setAvgDurationLabel(`${h}h ${m.toString().padStart(2, "0")}m`);
        } else {
          setAvgDurationLabel("0h 00m");
        }
      } else {
        setAvgDurationLabel("0h 00m");
      }
    } catch (error) {
      console.error("OS_SLEEP_LOAD_ERROR", error);
    }
  }, [user?.uid, days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async (action) => {
    if (action === "sleep") {
      const startTime = new Date().toISOString();
      localStorage.setItem("lifestyle_sleep_start", startTime);
      setIsAsleep(true);

      // Broadcast to Layout.jsx to instantly show the overlay
      window.dispatchEvent(new Event("sleep_status_changed"));
    } else if (action === "wake") {
      if (!user?.uid) return;
      const startIso = localStorage.getItem("lifestyle_sleep_start");

      try {
        if (startIso) {
          // Wait for the DB to successfully log the session
          await logSleepSession(user.uid, new Date(startIso), new Date());
        }
      } catch (error) {
        console.error("Failed to log sleep to DB. Unlocking UI anyway.", error);
      } finally {
        // FAILSAFE: Always runs, even if offline, preventing UI lock
        localStorage.removeItem("lifestyle_sleep_start");
        setIsAsleep(false);

        // Broadcast to all components to drop the overlay
        window.dispatchEvent(new Event("sleep_status_changed"));

        await loadData(); // Refresh the chart with the newly completed sleep
      }
    }
  };

  return { history, avgDurationLabel, isAsleep, targets, handleAction };
}
