import { db, auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// authentication and login service
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const syncUserProfile = async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    registeredAt: new Date(user.metadata.creationTime),
    lastLogin: serverTimestamp(),
  };

  try {
    await setDoc(userRef, userData, { merge: true });
    console.log("OS: User Profile Synced");
  } catch (error) {
    console.error("OS Error: Profile Sync Failed", error);
  }
};
