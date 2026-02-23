import { useLifestyle } from "../context/LifestyleContext";

const UserProfileCard = () => {
  const { user, logout } = useLifestyle();

  // Simple date formatter for the 'Registered' field
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    // If it's a Firestore Timestamp, convert to Date
    const d = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left: Avatar & Identity */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={user?.photoURL}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-lg"
          />
          {/* Status Indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {user?.displayName || "System User"}
          </h1>
          {/* <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
              //ADD gender and date of birth
            </span>
            <span>{user?.uid?.slice(0, 8)}...</span>
          </div> */}
        </div>
      </div>

      {/* Right: Meta Data & Actions */}
      <div className="flex flex-col items-end gap-3 w-full md:w-auto">
        {/* <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Member Since
          </p>
          <p className="text-slate-200 font-mono">
            {formatDate(user?.registeredAt)}
          </p>
        </div> */}

        <button
          onClick={logout}
          className="w-full md:w-auto px-6 py-2 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 border border-slate-700 hover:border-red-900/50 rounded-xl text-slate-300 text-sm font-medium transition-all duration-300"
        >
          Shutdown Session
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
