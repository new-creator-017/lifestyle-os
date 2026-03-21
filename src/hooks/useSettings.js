import { useState, useEffect } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import { saveUserSettings, getUserSettings } from "../services/settingsService";

export const useSettings = () => {
  const { user, showToast } = useLifestyle();

  const [settings, setSettings] = useState({
    targetBedtime: "00:00",
    targetWakeTime: "07:30",
    targetWeight: "",
    targetWaist: "", // Cleared default to let you type fresh
    meal1Time: "13:00",
    meal2Time: "19:00",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserSettings(user.uid).then((data) => {
        if (data) setSettings((prev) => ({ ...prev, ...data }));
      });
    }
  }, [user?.uid]);

  // The dynamic constraint engine
  const validateNumeric = (val, maxWhole) => {
    if (val === "") return ""; // Allow complete deletion
    if (!/^\d*\.?\d*$/.test(val)) return null; // Reject letters/symbols immediately

    const [whole, decimal] = val.split(".");

    // Enforce the specific digit limits
    if (whole.length > maxWhole) return null;
    if (decimal !== undefined && decimal.length > 2) return null; // Max 2 decimal places

    return val;
  };

  const updateSetting = (key, value) => {
    // Route the input through our validators if it's one of the metrics
    if (key === "targetWeight") {
      const valid = validateNumeric(value, 3); // 3 digits before decimal
      if (valid === null) return;
      value = valid;
    } else if (key === "targetWaist") {
      const valid = validateNumeric(value, 2); // 2 digits before decimal
      if (valid === null) return;
      value = valid;
    }

    setSettings((prev) => ({ ...prev, [key]: value }));
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

  return { settings, updateSetting, handleSave, isSaving };
};
