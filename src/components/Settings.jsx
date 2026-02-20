export default function Settings({
  targetTime,
  setTargetTime,
  notificationsEnabled,
  setNotificationsEnabled,
}) {
  const handleToggle = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <h1 className="text-2xl font-bold">Configuration</h1>

      {/* Bedtime Input */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
        <label className="block text-gray-400 mb-2">Target Bedtime</label>
        <input
          type="time"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
          className="w-full bg-gray-700 p-4 rounded-xl text-xl text-white outline-none border-2 border-transparent focus:border-blue-500"
        />
      </div>

      {/* Notification Toggle */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h3 className="font-medium">Bedtime Reminders</h3>
          <p className="text-xs text-gray-500">Persistent Cloud Nudges</p>
        </div>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? "bg-green-500" : "bg-gray-600"}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? "left-7" : "left-1"}`}
          />
        </button>
      </div>
    </div>
  );
}
