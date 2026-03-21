// src/context/LifestyleContext.jsx
import { createContext, useContext, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LifestyleContext = createContext();

export const LifestyleProvider = ({ children }) => {
  const auth = useAuth(); // Identity Logic

  // 1. Create the Toast State
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // Can be "success" or "error"
  });

  // 2. Create the Trigger Function
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });

    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // 3. Add toast and showToast to the values shared across the app
  const value = {
    ...auth,
    toast,
    showToast,
  };

  return (
    <LifestyleContext.Provider value={value}>
      {/* We use auth.authLoading from the useAuth hook */}
      {!auth.authLoading && children}
    </LifestyleContext.Provider>
  );
};

export const useLifestyle = () => useContext(LifestyleContext);
