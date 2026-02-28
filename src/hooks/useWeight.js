import { useState } from "react";
import { useLifestyle } from "../context/LifestyleContext";
import { logWeightEntry } from "../services/weightService";

export const useWeight = () => {
  const { user } = useLifestyle();
  const [weight, setWeight] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleWeightChange = (e) => {
    const val = e.target.value;

    // 1. Allow deletion
    if (val === "") return setWeight("");

    // 2. Reject non-numeric characters immediately
    if (!/^\d*\.?\d*$/.test(val)) return;

    // 3. Split to enforce the "3 before, 2 after" rule
    const [whole, decimal] = val.split(".");

    // RULE: Max 3 digits for the whole number (Capped at 999)
    if (whole.length > 3) return;

    // RULE: Max 2 digits for the decimal (Capped at .99)
    if (decimal && decimal.length > 2) return;

    setWeight(val);
  };

  const handleLog = async () => {
    const numericWeight = parseFloat(weight);

    if (isNaN(numericWeight) || !user?.uid) return;
    setIsSyncing(true);
    try {
      await logWeightEntry(user.uid, numericWeight);
      setWeight(""); // Clear on success
    } catch (err) {
      console.error("OS_SYNC_ERROR", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    weight,
    handleWeightChange,
    isSyncing,
    handleLog,
    currentWeight: user?.stats?.weight?.value || null,
  };
};
