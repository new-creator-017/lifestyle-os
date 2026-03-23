import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const runPhysiqueSeed = async (userId) => {
  if (!userId) return;

  const entries = [];
  const today = new Date();

  // Starting points
  let currentWeight = 110;
  let currentWaist = 40;

  // We are going back 365 days
  for (let i = 365; i >= 0; i--) {
    // 50% chance to log a day
    if (Math.random() > 0.5) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      /**
       * The Math:
       * We want to drop from 110 to ~94kg over 365 days.
       * Daily average drop: ~0.043 kg
       * Daily average waist drop: ~0.013 inches
       */
      const dayFactor = 365 - i;
      const weightTrend = 110 - dayFactor * 0.043;
      const waistTrend = 40 - dayFactor * 0.013;

      // Add "Human" noise (water weight fluctuations)
      const weightNoise = (Math.random() - 0.5) * 0.8; // +/- 0.4kg
      const waistNoise = (Math.random() - 0.5) * 0.2; // +/- 0.1in

      entries.push({
        date: dateStr,
        weight: parseFloat((weightTrend + weightNoise).toFixed(1)),
        waist: parseFloat((waistTrend + waistNoise).toFixed(1)),
        timestamp: date.toISOString(),
      });
    }
  }

  console.log(`OS_SEED: Generating ${entries.length} physique entries...`);

  for (const entry of entries) {
    const docRef = doc(db, "users", userId, "metrics", entry.date);
    await setDoc(docRef, entry, { merge: true });
  }

  console.log("OS_SEED_COMPLETE: One year of physique data injected.");
};
