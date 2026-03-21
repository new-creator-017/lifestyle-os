// src/config/moduleConfig.js
import { House, Scale, Settings } from "lucide-react";
import DashboardModule from "./DashboardModule";
import WeightModule from "./WeightModule";
import SettingsModule from "./SettingsModule";

export const APP_MODULES = [
  { name: "Home", path: "/", component: DashboardModule, icon: House },
  { name: "Weight", path: "/weight", component: WeightModule, icon: Scale },
  {
    name: "Settings",
    path: "/settings",
    component: SettingsModule,
    icon: Settings,
  },
];
