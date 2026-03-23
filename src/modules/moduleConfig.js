import { House, Activity, Moon, Settings } from "lucide-react";
import DashboardModule from "./DashboardModule";
import PhysiqueModule from "./PhysiqueModule";
import SleepModule from "./SleepModule";
import SettingsModule from "./SettingsModule";

export const APP_MODULES = [
  {
    name: "Home",
    path: "/",
    component: DashboardModule,
    icon: House,
  },
  {
    name: "Physique",
    path: "/physique",
    component: PhysiqueModule,
    icon: Activity,
  },
  {
    name: "Sleep",
    path: "/sleep",
    component: SleepModule,
    icon: Moon,
  },
  {
    name: "Settings",
    path: "/settings",
    component: SettingsModule,
    icon: Settings,
  },
];
