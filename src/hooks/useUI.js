import { useState } from "react";

export function useUI() {
  // We start on "home" by default
  const [activeTab, setActiveTab] = useState("home");

  // This function makes it easy to switch tabs from any component
  const changeTab = (tabName) => {
    setActiveTab(tabName);
    // You could also add logic here to scroll to top
    // or play a sound effect when a tab changes
    window.scrollTo(0, 0);
  };

  return {
    activeTab,
    changeTab,
  };
}
