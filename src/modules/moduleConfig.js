// src/config/moduleConfig.js
import { House, Scale } from "lucide-react";
import DashboardModule from "./DashboardModule";
import WeightModule from "./WeightModule";

export const APP_MODULES = [
  { name: "Home", path: "/", component: DashboardModule, icon: House },
  { name: "Weight", path: "/weight", component: WeightModule, icon: Scale },
];
