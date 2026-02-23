import { useLifestyle } from "../context/LifestyleContext";
import UserProfileCard from "../components/UserProfileCard"; // Assuming you split them, or keep it in the same file

const DashboardModule = () => {
  const { user } = useLifestyle();

  return (
    // The main container for your OS Dashboard
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* TOP SECTION: The Rounded Profile Card */}
        <header>
          <UserProfileCard />
        </header>

        {/* BOTTOM SECTION: The Goals Workspace */}
        <main className="grid grid-cols-1 gap-8">
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
              Core Objectives
            </h3>

            {/* We will build the Add Goal input and List here next */}
            <div className="text-slate-500 italic text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              Waiting for objective input...
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardModule;
