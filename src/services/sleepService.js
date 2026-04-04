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

    // FIX 1: Use local time instead of UTC to prevent timezone shifting bugs when traveling
    const dateStr = wakeTime.toLocaleDateString("en-CA");

    // Get initial decimals
    let bedDec = timeToDecimal(sleepTime);
    let wakeDec = timeToDecimal(wakeTime);

    // FIX 2: THE "PAST NOON" FAILSAFE
    // If you sleep at 1:00 AM (25.0) and wake at 1:00 PM (13.0),
    // force wake to 37.0 so the Recharts graph doesn't draw a backwards zig-zag!
    if (wakeDec < bedDec) {
      wakeDec += 24;
    }

    const payload = {
      date: dateStr,
      bed: bedDec,
      wake: wakeDec,
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
