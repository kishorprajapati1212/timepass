import FacultyRoutes from "../../../routes/FacultyRoutes";
import Faculty_Navbar from "./components/Faculty_Navbar";

const Faculty = () => {
  return (
    <div className="relative h-screen flex bg-[#020617] text-slate-50 overflow-hidden selection:bg-cyan-500/30">
      
      {/* BACKGROUND BLOBS (Consistent with Home) */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />

      {/* Sidebar Navigation */}
      <Faculty_Navbar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar scroll-smooth relative z-10">
        <FacultyRoutes />
      </div>
    </div>
  );
};

export default Faculty;