import { useState, useEffect } from "react";
import { User, Home, QrCode, Bell, BookOpen, TrendingUp } from "lucide-react";
import QRScanner from "../../../components/Student/QRScanner";
import axiosInstance from "../../../utils/AxiosInstance";

const Student = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState({ summary: {}, subjectBreakdown: [], details: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("attendx_user") || "{}");
    setUser(stored.user);
    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get("/api/report/student/my-attendance");
        setAttendance(res.data.data || { summary: {}, subjectBreakdown: [], details: [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name?.split(' ')[0] || "Student"}!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Attendance Rate</p>
                <p className="text-2xl font-bold text-cyan-400">{attendance.summary?.percentage || 0}%</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Total Lectures</p>
                <p className="text-2xl font-bold text-purple-400">{attendance.summary?.totalLectures || 0}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Present</p>
                <p className="text-2xl font-bold text-green-400">{attendance.summary?.present || 0}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Absent</p>
                <p className="text-2xl font-bold text-red-400">{attendance.summary?.absent || 0}</p>
              </div>
            </div>
            <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-cyan-400" /> Subject Breakdown</h3>
              {attendance.subjectBreakdown?.length === 0 ? (
                <p className="text-slate-500 text-sm">No attendance data yet.</p>
              ) : (
                <div className="space-y-3">
                  {attendance.subjectBreakdown.map((sub) => (
                    <div key={sub.subject} className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">{sub.subject}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${sub.total > 0 ? (sub.present / sub.total) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-slate-400 text-xs">{sub.present}/{sub.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "qr":
        return <QRScanner onBack={() => setActiveTab("home")} />;
      case "profile":
        return (
          <div className="p-6 flex flex-col items-center animate-in slide-in-from-bottom-4">
            <div className="w-24 h-24 bg-linear-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800">
              {user?.name?.[0] || "S"}
            </div>
            <h2 className="mt-4 text-xl font-bold">{user?.name || "Student"}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <div className="w-full mt-8 space-y-3">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                <BookOpen size={20} className="text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Roll Number</p>
                  <p className="text-slate-100 font-semibold">{user?.rollNumber || "—"}</p>
                </div>
              </div>
              <button onClick={() => { localStorage.removeItem("attendx_user"); window.location.href = "/login"; }}
                className="w-full flex items-center gap-4 bg-red-900/20 p-4 rounded-2xl border border-red-900/30 text-red-400">
                Logout
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-slate-800 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">A</div>
          <h1 className="text-xl font-bold tracking-tight text-cyan-400">AttendX</h1>
        </div>
        <Bell size={24} className="text-slate-400" />
      </header>
      <main className="flex-1 pb-24">{renderContent()}</main>
      <nav className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 px-6 py-3 rounded-[2.5rem] flex items-center justify-between w-full max-w-sm shadow-2xl">
          <button onClick={() => setActiveTab("home")}
            className={`p-2 rounded-full transition-all ${activeTab === 'home' ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'}`}>
            <Home size={28} />
          </button>
          <button onClick={() => setActiveTab("qr")}
            className="bg-cyan-500 p-4 rounded-full -mt-12 border-4 border-[#020617] shadow-xl shadow-cyan-500/20 text-slate-900 hover:scale-110 transition-transform">
            <QrCode size={32} strokeWidth={2.5} />
          </button>
          <button onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-full transition-all ${activeTab === 'profile' ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'}`}>
            <User size={28} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Student;
