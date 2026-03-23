import { useState, useEffect, useCallback } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import { logSleepAction, getSleepHistory } from "../services/sleepService";

/**
 * HELPER: Converts "HH:mm" to a decimal relative to Noon.
 * Noon (12:00 PM) = 0
 * Midnight (00:00) = 12
 * Morning (08:00 AM) = 20
 * Next Day Noon (12:00 PM) = 24
 */
const toNoonDecimal = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const decimal = h + m / 60;
  return h >= 12 ? decimal - 12 : decimal + 12;
};

/**
 * HELPER: Translates decimal hours to "Xh Ym" string
 */
const formatDuration = (decimalHours) => {
  if (!decimalHours || decimalHours <= 0) return "0h 0m";
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  return `${h}h ${m}m`;
};

export const useSleep = (days = 7) => {
  const { user, showToast } = useLifestyle();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [isAsleep, setIsAsleep] = useState(false);
  const [avgDurationLabel, setAvgDurationLabel] = useState("0h 0m");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      // Fetch data based on pagination
      const totalToFetch = (page + 1) * days;
      const rawData = await getSleepHistory(user.uid, totalToFetch);

      // Slice the specific page window
      const startIndex = page * days;
      const pageData = rawData.slice(startIndex, startIndex + days);

      const processed = pageData
        .map((day) => {
          const bed = toNoonDecimal(day.sleepTime);
          let wake = toNoonDecimal(day.wakeTime);

          // EDGE CASE: If wake time is numerically less than or equal to bed time
          // (e.g., Slept at 2 AM [14], Woke at 1 PM [1]),
          // we add 24 to keep the timeline linear.
          if (wake !== null && bed !== null && wake <= bed) {
            wake += 24;
          }

          // Calculate raw duration for math
          const durationRaw = wake !== null && bed !== null ? wake - bed : 0;

          return {
            ...day,
            bed,
            wake,
            displaySleep: day.sleepTime || "--:--",
            displayWake: day.wakeTime || "--:--",
            durationDisplay: formatDuration(durationRaw),
            durationRaw,
          };
        })
        .reverse(); // Reverse so recent data is on the right of the graph

      setHistory(processed);

      // Calculate Average Duration for the current view
      const validEntries = processed.filter((d) => d.durationRaw > 0);
      const avgHours =
        validEntries.length > 0
          ? validEntries.reduce((acc, curr) => acc + curr.durationRaw, 0) /
            validEntries.length
          : 0;

      setAvgDurationLabel(formatDuration(avgHours));
    } catch (error) {
      console.error("OS_SLEEP_LOAD_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, days, page]);

  // Sync state on load and when dependencies change
  useEffect(() => {
    loadData();
    const localStatus = localStorage.getItem("os_is_asleep") === "true";
    setIsAsleep(localStatus);
  }, [loadData]);

  const handleAction = async (type) => {
    try {
      await logSleepAction(user.uid, type);

      const newAsleepState = type === "sleep";
      setIsAsleep(newAsleepState);
      localStorage.setItem("os_is_asleep", newAsleepState);

      showToast(
        type === "sleep" ? "System entering Cradle Mode." : "System Online.",
        "success",
      );

      await loadData();
    } catch (e) {
      showToast("Sync failed. Check connection.", "error");
    }
  };

  return {
    history,
    avgDurationLabel,
    isAsleep,
    loading,
    page,
    setPage,
    handleAction,
  };
};
