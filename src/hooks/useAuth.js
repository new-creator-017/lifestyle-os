import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { syncUserProfile, logoutUser } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // LOGOUT: High-level function for UI components
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("OS Error: Logout failed", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          await syncUserProfile(currentUser);
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("OS Error: Auth Sync Failed", error);
      } finally {
        setAuthLoading(false);
      }
    });

    // Cleanup listener when the app unmounts
    return () => unsubscribe();
  }, []);

  return { user, authLoading, logout };
}
