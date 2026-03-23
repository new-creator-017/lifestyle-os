import { useSettings } from "../hooks/useSettings";

// 1. Defined OUTSIDE the main component
const SettingInput = ({
  label,
  value,
  onChange,
  type = "text",
  suffix = "",
  inputMode = "text",
}) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5">
    <label className="text-zinc-400 font-mono text-xs uppercase tracking-wider">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type={type}
        inputMode={inputMode}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800/50 text-white text-right px-3 py-1 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500 w-24"
      />
      {suffix && (
        <span className="text-zinc-600 text-[10px] font-black w-4">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default function SettingsModule() {
  const { settings, updateSetting, handleSave, isSaving, toggleNotifications } =
    useSettings();

  return (
    <div className="max-w-md mx-auto space-y-8 px-4 pb-6">
      <header>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
          System Targets
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure your core lifestyle anchors.
        </p>
      </header>

      <section className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 shadow-xl">
        <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
          Sleep & Routine
        </h2>
        <SettingInput
          label="Lights Out"
          type="time"
          value={settings.targetBedtime}
          onChange={(v) => updateSetting("targetBedtime", v)}
        />
        <SettingInput
          label="Wake Up"
          type="time"
          value={settings.targetWakeTime}
          onChange={(v) => updateSetting("targetWakeTime", v)}
        />

        <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] mt-8 mb-4">
          Metabolic Targets
        </h2>

        <SettingInput
          label="Target Weight"
          value={settings.targetWeight}
          suffix="KG"
          inputMode="decimal"
          onChange={(v) => updateSetting("targetWeight", v)}
        />
        <SettingInput
          label="Target Waist"
          value={settings.targetWaist}
          suffix="IN"
          inputMode="decimal"
          onChange={(v) => updateSetting("targetWaist", v)}
        />

        <SettingInput
          label="Target Stomach"
          value={settings.targetStomach}
          suffix="IN"
          inputMode="decimal"
          onChange={(v) => updateSetting("targetStomach", v)}
        />

        <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] mt-8 mb-4">
          Nutrition Window
        </h2>
        <SettingInput
          label="Meal 1 (Break)"
          type="time"
          value={settings.meal1Time}
          onChange={(v) => updateSetting("meal1Time", v)}
        />
        <SettingInput
          label="Meal 2 (Mid)"
          type="time"
          value={settings.meal2Time}
          onChange={(v) => updateSetting("meal2Time", v)}
        />
        <SettingInput
          label="Meal 3 (Close)"
          type="time"
          value={settings.meal3Time}
          onChange={(v) => updateSetting("meal3Time", v)}
        />

        {/* NEW SECTION: System Alerts with Toggle Slider */}
        <h2 className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] mt-8 mb-4">
          System Alerts
        </h2>
        <div className="flex items-center justify-between py-4 border-b border-white/5">
          <label className="text-zinc-400 font-mono text-xs uppercase tracking-wider">
            Push Notifications
          </label>
          <button
            type="button"
            onClick={toggleNotifications}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 outline-none ${
              settings.notificationsActive ? "bg-cyan-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                settings.notificationsActive ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
      >
        {isSaving ? "Syncing..." : "Save Configuration"}
      </button>
    </div>
  );
}
