import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

// Helper: Converts a Date object to the Noon-Ruler decimal system for the graph
// E.g., 10:30 PM -> 22.5.  2:00 AM -> 26.0
const timeToDecimal = (dateObj) => {
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  let decimal = hours + minutes / 60;

  // If the time is past midnight (AM), add 24 so the line visually crosses midnight
  if (decimal < 12) {
    decimal += 24;
  }
  return parseFloat(decimal.toFixed(2));
};

// Helper: Formats "23:30" or "07:00" strings
const formatDisplayTime = (dateObj) => {
  return dateObj.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSleepHistory = async (uid, days) => {
  try {
    const sleepRef = collection(db, "users", uid, "sleep");
    // Fetch newest logs first, limited by the days requested
    const q = query(sleepRef, orderBy("date", "desc"), limit(days));
    const snapshot = await getDocs(q);

    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Reverse the array so chronological order goes left-to-right on the graph
    return data.reverse();
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    return [];
  }
};

export const logSleepSession = async (uid, sleepTime, wakeTime) => {
  try {
    // Calculate duration in decimal hours (e.g., 7.5 hours)
    const diffMs = wakeTime - sleepTime;
    const duration = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    // Assign this sleep to the "wake up" date
    const dateStr = wakeTime.toISOString().split("T")[0];

    const payload = {
      date: dateStr,
      bed: timeToDecimal(sleepTime),
      wake: timeToDecimal(wakeTime),
      displaySleep: formatDisplayTime(sleepTime),
      displayWake: formatDisplayTime(wakeTime),
      duration: duration,
    };

    const docRef = doc(db, "users", uid, "sleep", dateStr);
    await setDoc(docRef, payload, { merge: true });

    return true;
  } catch (error) {
    console.error("Error logging sleep session:", error);
    throw error;
  }
};
