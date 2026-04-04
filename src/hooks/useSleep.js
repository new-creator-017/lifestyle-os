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
  const [avgDurationLabel, setAvgDurationLabel] = useState("0h 0m");
  const [isAsleep, setIsAsleep] = useState(false);

  // Default fallback targets just in case settings are empty
  const [targets, setTargets] = useState({ bed: 23.5, wake: 31.0 });

  useEffect(() => {
    const session = localStorage.getItem("lifestyle_sleep_start");
    if (session) setIsAsleep(true);
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
          const h = Math.floor(avgHours);
          const m = Math.round((avgHours - h) * 60);
          setAvgDurationLabel(`${h}h ${m === 0 ? "00" : m}m`);
        } else {
          setAvgDurationLabel("0h 0m");
        }
      } else {
        setAvgDurationLabel("0h 0m");
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
    } else if (action === "wake") {
      if (!user?.uid) return;
      const startIso = localStorage.getItem("lifestyle_sleep_start");

      if (startIso) {
        await logSleepSession(user.uid, new Date(startIso), new Date());
      }

      localStorage.removeItem("lifestyle_sleep_start");
      setIsAsleep(false);
      await loadData();
    }
  };

  return { history, avgDurationLabel, isAsleep, targets, handleAction };
}
