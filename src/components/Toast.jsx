export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
        <span className="animate-spin-slow">🔄</span>
        {message}
      </div>
    </div>
  );
}
