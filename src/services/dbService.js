import { db } from "./firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const dbService = {
  // 1. Listen for changes in your Master Config
  // Path: config (collection) -> settings (document)
  subscribeToSettings(callback) {
    const docRef = doc(db, "config", "settings");
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        console.warn("No settings document found in Firestore!");
      }
    });
  },

  // 2. Update specific fields in your Master Config
  async updateSettings(settings) {
    const docRef = doc(db, "config", "settings");
    // { merge: true } ensures we don't overwrite the whole doc,
    // just the fields we send (like targetBedtime)
    return await setDoc(docRef, settings, { merge: true });
  },

  // 3. Generic Logging Engine
  // Can be used for 'sleep', 'wake', 'water', etc.
  async logEntry(type, data) {
    try {
      const colRef = collection(db, type);
      await addDoc(colRef, {
        ...data,
        timestamp: serverTimestamp(), // Uses Google's clock, not the phone's
      });
      return true;
    } catch (e) {
      console.error("Error logging entry: ", e);
      return false;
    }
  },
};
