import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const dbService = {
  // Syncs Google Auth data with our Firestore 'users' collection
  syncUserProfile: async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      registeredAt: new Date(user.metadata.creationTime),
      lastLogin: serverTimestamp(),
      // We use merge: true so we don't overwrite custom settings
      // like "theme" that might already exist in the document
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log("OS: User Profile Synced");
    } catch (error) {
      console.error("OS Error: Profile Sync Failed", error);
    }
  },
};
