import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const saveUserSettings = async (userId, settings) => {
  if (!userId) throw new Error("Missing user ID");
  const settingsRef = doc(db, "users", userId, "config", "targets");

  try {
    await setDoc(settingsRef, settings, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("SETTINGS_SYNC_ERROR:", error);
    throw error;
  }
};

export const getUserSettings = async (userId) => {
  if (!userId) return null;
  const settingsRef = doc(db, "users", userId, "config", "targets");
  const snap = await getDoc(settingsRef);
  return snap.exists() ? snap.data() : null;
};
