// src/context/LifestyleContext.jsx
import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";

const LifestyleContext = createContext();

export const LifestyleProvider = ({ children }) => {
  const auth = useAuth(); // Identity Logic

  const value = {
    ...auth,
  };

  return (
    <LifestyleContext.Provider value={value}>
      {/* We use auth.authLoading from the useAuth hook */}
      {!auth.authLoading && children}
    </LifestyleContext.Provider>
  );
};

export const useLifestyle = () => useContext(LifestyleContext);
