import { useLifestyle } from "../context/LifestyleContext";

export default function Navbar() {
  const { activeTab, changeTab } = useLifestyle();

  const tabs = ["home", "sleep", "settings"];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
