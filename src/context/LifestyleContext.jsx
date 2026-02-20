import { createContext, useContext } from "react";
import { useLifestyleData } from "../hooks/useLifestyleData";
import { useUI } from "../hooks/useUI";

// 1. Create the actual "Cloud" container
const LifestyleContext = createContext();

export const LifestyleProvider = ({ children }) => {
  // 2. Initialize our hooks inside the Provider
  const lifestyle = useLifestyleData();
  const ui = useUI();

  // 3. Combine them into one "Master State" object
  const value = {
    ...lifestyle,
    ...ui,
  };

  return (
    <LifestyleContext.Provider value={value}>
      {children}
    </LifestyleContext.Provider>
  );
};

// 4. Create a custom "Consumer" hook for easy access
export const useLifestyle = () => {
  const context = useContext(LifestyleContext);
  if (!context) {
    throw new Error("useLifestyle must be used within a LifestyleProvider");
  }
  return context;
};
