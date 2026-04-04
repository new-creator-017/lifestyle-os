import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
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
    let q;

    if (days === "ALL") {
      // Fetch everything, naturally sorted from oldest to newest
      q = query(metricsRef, orderBy("date", "asc"));
    } else {
      // Calculate the exact date 'days' ago
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);
      const cutoffDateStr = targetDate.toLocaleDateString("en-CA");

      // Query strictly for documents from that date forward, ordered chronologically
      q = query(
        metricsRef,
        where("date", ">=", cutoffDateStr),
        orderBy("date", "asc"),
      );
    }

    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => doc.data());

    // No need to reverse since orderBy("date", "asc") handled the chronology natively
    return data;
  } catch (error) {
    console.error("PHYSIQUE_FETCH_ERROR:", error);
    return [];
  }
};
