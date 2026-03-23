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

export const logSleepAction = async (userId, type) => {
  if (!userId) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA");
  const timeStr = now.toTimeString().split(" ")[0].slice(0, 5); // "HH:mm"

  const sleepRef = doc(db, "users", userId, "sleep", dateStr);

  const data = {
    date: dateStr,
    [`${type}Time`]: timeStr,
    [`${type}Timestamp`]: now.toISOString(),
  };

  try {
    await setDoc(sleepRef, data, { merge: true });

    // Update the global "asleep" status for the UI Cradle Mode
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      { status: { isAsleep: type === "sleep" } },
      { merge: true },
    );

    return { success: true };
  } catch (error) {
    console.error("SLEEP_SERVICE_ERROR:", error);
    throw error;
  }
};

export const getSleepHistory = async (userId, days = 7) => {
  const sleepRef = collection(db, "users", userId, "sleep");
  const q = query(sleepRef, orderBy("date", "desc"), limit(days));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
};
