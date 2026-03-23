import { useState, useEffect } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import { saveUserSettings, getUserSettings } from "../services/settingsService";

export const useSettings = () => {
  const { user, showToast } = useLifestyle();

  const [settings, setSettings] = useState({
    targetBedtime: "00:00",
    targetWakeTime: "07:30",
    targetWeight: "",
    targetWaist: "",
    targetStomach: "",
    meal1Time: "13:00",
    meal2Time: "19:00",
    meal3Time: "22:00",
    notificationsActive: false, // Notification state
  });
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch data from Firebase on load
  useEffect(() => {
    if (user?.uid) {
      getUserSettings(user.uid).then((data) => {
        if (data) setSettings((prev) => ({ ...prev, ...data }));
      });
    }
  }, [user?.uid]);

  // 2. Cross-check Firebase state with actual OS permission on load
  useEffect(() => {
    if ("Notification" in window) {
      if (
        Notification.permission === "denied" &&
        settings.notificationsActive
      ) {
        setSettings((prev) => ({ ...prev, notificationsActive: false }));
      }
    }
  }, [settings.notificationsActive]);

  const validateNumeric = (val, maxWhole) => {
    if (val === "") return "";
    if (!/^\d*\.?\d*$/.test(val)) return null;

    const [whole, decimal] = val.split(".");
    if (whole.length > maxWhole) return null;
    if (decimal !== undefined && decimal.length > 2) return null;

    return val;
  };

  const updateSetting = (key, value) => {
    if (key === "targetWeight") {
      const valid = validateNumeric(value, 3);
      if (valid === null) return;
      value = valid;
    } else if (key === "targetWaist") {
      const valid = validateNumeric(value, 2);
      if (valid === null) return;
      value = valid;
    } else if (key === "targetStomach") {
      const valid = validateNumeric(value, 2);
      if (valid === null) return;
      value = valid;
    }

    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Notification Toggle Logic
  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      showToast("Push not supported. Add to Home Screen first.", "error");
      return;
    }

    if (Notification.permission === "denied") {
      showToast("Blocked by iOS. Enable in native Settings.", "error");
      setSettings((prev) => ({ ...prev, notificationsActive: false }));
      return;
    }

    // Request permission if not yet asked
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateSetting("notificationsActive", true);
        showToast("System notifications authorized.", "success");
      } else {
        updateSetting("notificationsActive", false);
        showToast("Authorization denied.", "error");
      }
      return;
    }

    // If already granted, toggle internal state
    const newState = !settings.notificationsActive;
    updateSetting("notificationsActive", newState);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserSettings(user.uid, settings);
      showToast("System targets updated.", "success");
    } catch (error) {
      showToast("Failed to save targets.", "error");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return { settings, updateSetting, handleSave, isSaving, toggleNotifications };
};
