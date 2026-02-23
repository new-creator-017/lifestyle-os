// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { dbService } from "../services/dbService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("OS: User logged out");
    } catch (error) {
      console.error("OS Error: Logout failed", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const handleAuthChange = async () => {
        if (currentUser) {
          await dbService.syncUserProfile(currentUser);
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      };

      // Run it!
      handleAuthChange();
    });

    return () => unsubscribe();
  }, []);

  return { user, authLoading, logout };
}
