import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LifestyleProvider } from "./context/LifestyleContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* This wraps the entire OS in our data cloud */}
    <LifestyleProvider>
      <App />
    </LifestyleProvider>
  </React.StrictMode>,
);

// At the bottom of main.jsx
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registered!", reg))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
