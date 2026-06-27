import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, QrCode, History, User, LogOut, BookOpen, Users, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice.js";
import LiveSession from "../../components/Faculty/LiveSession.jsx";
import SessionHistory from "../../components/Faculty/SessionHistory.jsx";
import FacultyProfile from "../../components/Faculty/Profile.jsx";
import axiosInstance from "../../utils/axios.js";
import { toast } from "react-toastify";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { const res = await axiosInstance.get("/api/report/faculty/dashboard"); setStats(res.data?.data || res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { dispatch(logout()); toast.info("Logged out successfully"); navigate("/login"); };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "session", label: "Session", icon: QrCode },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">Welcome, {user?.name?.split(" ")[0] || "Faculty"}!</h2><p className="text-slate-400 text-sm mt-1">Faculty Dashboard</p></div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">{user?.name?.charAt(0)?.toUpperCase() || "F"}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Lectures", value: stats?.totalLectures || 0, icon: BookOpen, color: "text-blue-400" },
          { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "text-cyan-400" },
          { label: "Avg Attendance", value: `${stats?.averageAttendance || 0}%`, icon: TrendingUp, color: "text-emerald-400" },
          { label: "Today", value: stats?.todayLectures || 0, icon: Calendar, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><stat.icon size={16} className={stat.color} /><span className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</span></div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-5">
        <h3 className="font-bold text-lg mb-4">Recent Sessions</h3>
        {(!stats?.recentSessions || stats.recentSessions.length === 0) ? <p className="text-slate-500 text-sm">No sessions yet.</p> : (
          <div className="space-y-3">
            {stats.recentSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                <div><p className="font-medium text-sm">{session.subjectName || session.name || "Session"}</p><p className="text-xs text-slate-500">{session.date ? new Date(session.date).toLocaleDateString() : "N/A"}</p></div>
                <div className="text-right"><span className="text-sm font-bold text-cyan-400">{session.attendanceRate || 0}%</span><p className="text-xs text-slate-500">{session.presentCount || 0}/{session.totalStudents || 0}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50 pb-24">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight">Attend<span className="text-cyan-400">X</span></h1>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-rose-400 transition-colors"><LogOut size={20} /></button>
      </header>
      <main className="relative z-10 pt-16 px-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "session" && <LiveSession />}
            {activeTab === "history" && <SessionHistory />}
            {activeTab === "profile" && <FacultyProfile />}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-slate-700/50">
        <div className="max-w-lg mx-auto flex justify-around px-4 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon; const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 ${isActive ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 hover:text-slate-300"}`}>
                <Icon size={22} /><span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
export default FacultyDashboard;
