import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

/**
 * Logs physique metrics for today's date
 */
export const logPhysiqueData = async (userId, payload) => {
  if (!userId) throw new Error("Missing user ID");

  // Get current local date in YYYY-MM-DD format
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-CA"); // e.g., "2026-03-23"

  const docRef = doc(db, "users", userId, "metrics", dateStr);

  try {
    // merge: true allows updating just one metric without wiping the others for the day
    await setDoc(
      docRef,
      {
        ...payload,
        date: dateStr,
        timestamp: new Date().toISOString(),
      },
      { merge: true },
    );

    return { success: true };
  } catch (error) {
    console.error("PHYSIQUE_SYNC_ERROR:", error);
    throw error;
  }
};

/**
 * Retrieves the history of physique data based on a timeframe
 */
export const getPhysiqueHistory = async (userId, days = 30) => {
  if (!userId) return [];

  try {
    const metricsRef = collection(db, "users", userId, "metrics");
    // If 'ALL' is passed, fetch a large limit, otherwise use the days constraint
    const queryLimit = days === "ALL" ? 1000 : days;

    const q = query(metricsRef, orderBy("date", "desc"), limit(queryLimit));
    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => doc.data());

    // Reverse it so the oldest data is on the left of the graph, newest on the right
    return data.reverse();
  } catch (error) {
    console.error("PHYSIQUE_FETCH_ERROR:", error);
    return [];
  }
};
