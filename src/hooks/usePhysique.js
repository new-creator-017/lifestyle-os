import { useState, useEffect, useCallback } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import {
  logPhysiqueData,
  getPhysiqueHistory,
} from "../services/physiqueService";
import { getUserSettings } from "../services/settingsService";

export const usePhysique = () => {
  const { user, showToast } = useLifestyle();

  // Raw states
  const [weight, setRawWeight] = useState("");
  const [waist, setRawWaist] = useState("");
  const [stomach, setRawStomach] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);
  const [history, setHistory] = useState([]);
  const [targets, setTargets] = useState({});
  const [timeRange, setTimeRange] = useState(30);

  // 1. DYNAMIC CONSTRAINT ENGINE
  const validateNumeric = (val, maxWhole) => {
    if (val === "") return ""; // Allow complete deletion
    if (!/^\d*\.?\d*$/.test(val)) return null; // Reject letters/symbols immediately

    const [whole, decimal] = val.split(".");

    // Enforce the specific digit limits
    if (whole.length > maxWhole) return null;
    if (decimal !== undefined && decimal.length > 2) return null; // Max 2 decimal places

    return val;
  };

  // 2. WRAPPED SETTERS
  const setWeight = (val) => {
    const valid = validateNumeric(val, 3); // 3 digits before decimal
    if (valid !== null) setRawWeight(valid);
  };

  const setWaist = (val) => {
    const valid = validateNumeric(val, 2); // 2 digits before decimal
    if (valid !== null) setRawWaist(valid);
  };

  const setStomach = (val) => {
    const valid = validateNumeric(val, 2); // 2 digits before decimal
    if (valid !== null) setRawStomach(valid);
  };

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const [historyData, settingsData] = await Promise.all([
        getPhysiqueHistory(user.uid, timeRange),
        getUserSettings(user.uid),
      ]);
      setHistory(historyData);
      if (settingsData) setTargets(settingsData);
    } catch (error) {
      console.error("OS_PHYSIQUE_LOAD_ERROR", error);
    }
  }, [user?.uid, timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLog = async () => {
    if (!user?.uid) return;
    setIsSyncing(true);

    try {
      const payload = {};

      if (weight && !isNaN(weight)) payload.weight = parseFloat(weight);
      if (waist && !isNaN(waist)) payload.waist = parseFloat(waist);
      if (stomach && !isNaN(stomach)) payload.stomach = parseFloat(stomach);

      if (Object.keys(payload).length > 0) {
        await logPhysiqueData(user.uid, payload);
        showToast("Metrics Synced.", "success");

        // Clear fields using raw setters so it instantly empties
        setRawWeight("");
        setRawWaist("");
        setRawStomach("");

        await loadData();
      }
    } catch (error) {
      showToast("Sync failed.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    weight,
    setWeight,
    waist,
    setWaist,
    stomach,
    setStomach,
    isSyncing,
    handleLog,
    history,
    targets,
    timeRange,
    setTimeRange,
  };
};
