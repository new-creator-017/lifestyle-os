import { useState, useEffect, useCallback } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import {
  logMetricsEntry,
  getMetricsHistory,
} from "../services/physiqueService";
import { getUserSettings } from "../services/settingsService";

export const usePhysique = () => {
  const { user, showToast } = useLifestyle();

  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");

  const [history, setHistory] = useState([]);
  const [targets, setTargets] = useState({ weight: null, waist: null });
  const [timeRange, setTimeRange] = useState(30);
  const [isSyncing, setIsSyncing] = useState(false);

  const validateNumericInput = (val, maxWholeDigits) => {
    if (val === "") return "";
    if (!/^\d*\.?\d*$/.test(val)) return null;
    const [whole, decimal] = val.split(".");
    if (whole.length > maxWholeDigits || (decimal && decimal.length > 2))
      return null;
    return val;
  };

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userSettings = await getUserSettings(user.uid);
      if (userSettings) {
        setTargets({
          weight: Number(userSettings.targetWeight) || null,
          waist: Number(userSettings.targetWaist) || null,
        });
      }
      const data = await getMetricsHistory(user.uid, timeRange);
      setHistory(data);
    } catch (err) {
      console.error("Failed to load metrics data", err);
    }
  }, [user?.uid, timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLog = async () => {
    if (!user?.uid || (!weight && !waist)) return;
    setIsSyncing(true);
    try {
      await logMetricsEntry(user.uid, weight, waist);
      setWeight("");
      setWaist("");
      showToast("Physique metrics logged successfully.", "success");
      await loadData();
    } catch (err) {
      showToast("Failed to log metrics.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    weight,
    waist,
    setWeight: (val) => {
      const v = validateNumericInput(val, 3);
      if (v !== null) setWeight(v);
    },
    setWaist: (val) => {
      const v = validateNumericInput(val, 2);
      if (v !== null) setWaist(v);
    },
    isSyncing,
    handleLog,
    history,
    targets,
    timeRange,
    setTimeRange,
  };
};
