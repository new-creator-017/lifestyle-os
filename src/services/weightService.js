import { db } from "../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const logWeightEntry = async (userId, weight) => {
  if (!userId || !weight) throw new Error("Missing required data");

  const dateStr = new Date().toLocaleDateString("en-CA");
  const weightValue = Number(weight);
  const userRef = doc(db, "users", userId);
  const weightRef = doc(db, "users", userId, "weight", dateStr);

  try {
    await Promise.all([
      // Set the history: This overwrites if you log twice in one day
      setDoc(
        weightRef,
        {
          value: weightValue,
          date: dateStr,
        },
        { merge: true },
      ),

      // Update the Dashboard stats
      updateDoc(userRef, {
        "stats.weight": {
          value: weightValue,
          date: dateStr,
        },
      }),
    ]);

    console.log("OS_SYNC: Success");
    return { success: true };
  } catch (error) {
    console.error("OS_SYNC_ERROR:", error);
    throw error;
  }
};
