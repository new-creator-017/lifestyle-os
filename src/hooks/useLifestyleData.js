import { useState, useEffect } from "react";
import { dbService } from "../services/dbService";

export function useLifestyleData() {
  const [targetBedtime, setTargetBedtime] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  // 1. Sync settings from Firebase on mount
  useEffect(() => {
    const unsubscribe = dbService.subscribeToSettings((data) => {
      if (data) {
        // We use the exact naming from your Firebase document
        setTargetBedtime(data.targetBedtime || "23:00");
        setNotificationsEnabled(data.notificationsActive || false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription when the app closes
    return () => unsubscribe();
  }, []);

  // 2. Centralized logging logic for any module (Sleep, Water, etc.)
  const logAction = async (type, data) => {
    setStatus(`Logging ${type}...`);
    const success = await dbService.logEntry(type, data);

    if (success) {
      setStatus(`${type.toUpperCase()} synced! ✅`);
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus("Sync Error ❌");
    }
    return success;
  };

  // 3. Update Settings logic
  // Inside useLifestyleData.js

  const updateSetting = async (key, value) => {
    try {
      setStatus("Syncing settings..."); // Trigger the Toast
      await dbService.updateSettings({ [key]: value });
      setStatus("Settings updated! ✅"); // Success message

      // Clear the message after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus("Update failed ❌");
      console.error(error);
    }
  };

  // Helper to check if it's bedtime
  const isBedtimeReached = () => {
    if (!targetBedtime) return false;

    const now = new Date();
    const [targetHours, targetMinutes] = targetBedtime.split(":");

    const bedtimeDate = new Date();
    bedtimeDate.setHours(parseInt(targetHours), parseInt(targetMinutes), 0);

    return now >= bedtimeDate;
  };

  return {
    targetBedtime,
    isBedtimeReached: isBedtimeReached(),
    notificationsEnabled,
    isLoading,
    status,
    logAction,
    updateSetting,
  };
}
