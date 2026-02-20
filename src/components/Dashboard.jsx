export default function Dashboard({ onSleep, onWake, quality, setQuality }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Daily Logs</h1>

      {/* Quality Section */}
      <div className="bg-gray-800 p-4 rounded-2xl text-center shadow-xl">
        <p className="text-gray-400 text-sm mb-2">How did you sleep?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setQuality(star)}
              className={`text-3xl transition-all ${star <= quality ? "text-yellow-400 scale-110" : "text-gray-600"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={onSleep}
          className="w-full bg-indigo-600 p-5 rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          LOG SLEEP 🌙
        </button>
        <button
          onClick={onWake}
          className="w-full bg-orange-500 p-5 rounded-2xl text-xl font-bold text-gray-900 shadow-lg active:scale-95 transition-transform"
        >
          LOG WAKE ☀️
        </button>
      </div>
    </div>
  );
}
