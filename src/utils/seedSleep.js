import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const sleepDummyData = [
  { date: "2026-03-09", sleepTime: "23:30", wakeTime: "07:30" },
  { date: "2026-03-10", sleepTime: "00:15", wakeTime: "08:00" },
  { date: "2026-03-11", sleepTime: "23:45", wakeTime: "07:15" },
  { date: "2026-03-12", sleepTime: "01:30", wakeTime: "09:00" },
  { date: "2026-03-13", sleepTime: "22:30", wakeTime: "06:30" },
  { date: "2026-03-14", sleepTime: "02:15", wakeTime: "10:30" },
  { date: "2026-03-15", sleepTime: "23:50", wakeTime: "07:30" },
  { date: "2026-03-16", sleepTime: "03:00", wakeTime: "11:00" },
  { date: "2026-03-17", sleepTime: "21:00", wakeTime: "05:00" },
  { date: "2026-03-18", sleepTime: "00:00", wakeTime: "07:30" },
  { date: "2026-03-19", sleepTime: "04:30", wakeTime: "13:00" },
  { date: "2026-03-20", sleepTime: "23:45", wakeTime: "08:15" },
  { date: "2026-03-21", sleepTime: "01:00", wakeTime: "06:00" },
  { date: "2026-03-22", sleepTime: "00:05", wakeTime: "07:30" },
];

export const runSleepSeed = async (userId) => {
  if (!userId) throw new Error("Unauthorized");
  for (const day of sleepDummyData) {
    const docRef = doc(db, "users", userId, "sleep", day.date);
    await setDoc(docRef, day, { merge: true });
  }
};
