import { NavLink } from "react-router-dom";

const Faculty_Navbar = () => {
  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-md border-r border-slate-800 text-slate-300 flex flex-col p-6 z-20">
      <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
        Faculty Panel
      </h2>

      <div className="flex flex-col space-y-2">
        <NavLink 
          to="/faculty/" 
          className={({ isActive }) => 
            `py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
              isActive ? "bg-blue-600/20 text-cyan-400 border border-blue-500/30" : "hover:bg-slate-800 hover:text-slate-100"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink 
          to="/faculty/take-attendance" 
          className={({ isActive }) => 
            `py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
              isActive ? "bg-blue-600/20 text-cyan-400 border border-blue-500/30" : "hover:bg-slate-800 hover:text-slate-100"
            }`
          }
        >
          Take Attendance
        </NavLink>

        <NavLink 
          to="/faculty/get-all-students" 
          className={({ isActive }) => 
            `py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
              isActive ? "bg-blue-600/20 text-cyan-400 border border-blue-500/30" : "hover:bg-slate-800 hover:text-slate-100"
            }`
          }
        >
          View Students
        </NavLink>
      </div>
    </div>
  );
};

export default Faculty_Navbar;