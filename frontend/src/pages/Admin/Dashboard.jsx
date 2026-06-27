import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { LogOut, Users, BookOpen, UserCheck, Layers, Plus, UserPlus, ChevronRight, Building2, LayoutGrid } from "lucide-react";
import { logout } from "../../store/authSlice.js";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); toast.info("Logged out successfully"); navigate("/login"); };

  const menuItems = [
    { label: "Add User", icon: UserPlus, path: "/register", color: "cyan", desc: "Register students, faculty, admins" },
    { label: "Create Subject", icon: Plus, path: "/create-subject", color: "blue", desc: "Add new subjects to system" },
    { label: "Create Department", icon: Building2, path: "/create-department", color: "purple", desc: "Add academic departments" },
    { label: "Create Section", icon: LayoutGrid, path: "/create-section", color: "amber", desc: "Add class sections" },
    { label: "Assign Faculty", icon: UserCheck, path: "/assign-faculty", color: "emerald", desc: "Map faculty to subjects" },
    { label: "View Students", icon: Users, path: "/students", color: "rose", desc: "Browse all students" },
  ];

  const stats = [
    { label: "Students", value: "120", icon: Users, color: "text-cyan-400" },
    { label: "Faculty", value: "15", icon: BookOpen, color: "text-blue-400" },
    { label: "Subjects", value: "24", icon: Layers, color: "text-purple-400" },
    { label: "Attendance", value: "85%", icon: UserCheck, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight">Attend<span className="text-cyan-400">X</span><span className="text-xs font-medium text-slate-500 ml-2 uppercase tracking-wider">Admin</span></h1>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-rose-400 transition-colors"><LogOut size={20} /></button>
      </header>
      <main className="relative z-10 pt-20 px-4 max-w-6xl mx-auto pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name || "Admin"}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2"><stat.icon size={18} className={stat.color} /><span className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</span></div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link to={item.path} className="glass-card p-5 flex items-center justify-between hover:border-cyan-500/30 transition-all duration-300 group h-full">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} className="text-cyan-400" />
                  </div>
                  <div><h3 className="font-bold">{item.label}</h3><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div>
                </div>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
