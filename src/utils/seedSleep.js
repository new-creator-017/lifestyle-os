import { db } from "../firebase";
import { doc, writeBatch, collection } from "firebase/firestore";

export const seedSleepData = async (uid) => {
  try {
    const batch = writeBatch(db);
    const sleepRef = collection(db, "users", uid, "sleep");

    const today = new Date();

    // Generate 90 days of historical data
    for (let i = 0; i < 90; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const dateStr = targetDate.toISOString().split("T")[0];

      // Randomize sleep duration between 6.0 and 8.5 hours
      const duration = Number((Math.random() * 2.5 + 6.0).toFixed(2));

      // Randomize bedtime between 10:00 PM (22.0) and 1:00 AM (25.0)
      const bedDecimal = Number((Math.random() * 3 + 22).toFixed(2));

      // Calculate wake time
      let wakeDecimal = bedDecimal + duration;

      // FIXED: Accurately converts decimals to exact HH:mm strings
      const formatTime = (dec) => {
        let totalHours = dec;
        if (totalHours >= 24) totalHours -= 24;

        let h = Math.floor(totalHours);
        let m = Math.round((totalHours - h) * 60);

        // Edge case: If rounding pushes minutes to 60, roll over to the next hour
        if (m === 60) {
          h += 1;
          m = 0;
          if (h >= 24) h -= 24;
        }

        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      };

      batch.set(doc(sleepRef, dateStr), {
        date: dateStr,
        bed: bedDecimal,
        wake: wakeDecimal,
        displaySleep: formatTime(bedDecimal),
        displayWake: formatTime(wakeDecimal),
        duration: duration,
      });
    }

    await batch.commit();
    console.log("Successfully seeded 90 days of perfect sleep data!");
    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    return false;
  }
};
