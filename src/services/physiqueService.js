import { db } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";

export const logMetricsEntry = async (userId, weight, waist) => {
  if (!userId) throw new Error("Missing user ID");

  const dateStr = new Date().toLocaleDateString("en-CA");
  const userRef = doc(db, "users", userId);
  const metricsRef = doc(db, "users", userId, "metrics", dateStr);

  const data = { date: dateStr };
  if (weight) data.weight = Number(weight);
  if (waist) data.waist = Number(waist);

  try {
    await Promise.all([
      setDoc(metricsRef, data, { merge: true }),
      updateDoc(userRef, { "stats.currentMetrics": data }),
    ]);
    return { success: true };
  } catch (error) {
    console.error("OS_SYNC_ERROR:", error);
    throw error;
  }
};

export const getMetricsHistory = async (userId, timeRangeDays) => {
  if (!userId) return [];

  const metricsRef = collection(db, "users", userId, "metrics");
  let q = query(metricsRef, orderBy("date", "asc"));

  if (timeRangeDays !== "ALL") {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
    const cutoffStr = cutoffDate.toLocaleDateString("en-CA");
    q = query(
      metricsRef,
      where("date", ">=", cutoffStr),
      orderBy("date", "asc"),
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};
