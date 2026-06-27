import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, Users } from "lucide-react";
import axiosInstance from "../../utils/axios.js";
import { toast } from "react-toastify";

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try { const res = await axiosInstance.get("/api/report/saved-reports"); const data = res.data?.data || res.data || []; setSessions(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadReport = (lectureSessionId) => {
    window.open(`${axiosInstance.defaults.baseURL}/api/report/lecture/${lectureSessionId}/download`, "_blank");
    toast.success("Download started");
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Session History</h2>
      {sessions.length === 0 ? (
        <div className="glass-card p-8 text-center"><Calendar size={48} className="mx-auto text-slate-600 mb-3" /><p className="text-slate-400">No past sessions found.</p></div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-bold">{session.subjectName || "Unknown Subject"}</h3><p className="text-xs text-slate-500 mt-1">{session.date ? new Date(session.date).toLocaleDateString() : "N/A"} &bull; {session.sectionName || "Unknown Section"}</p></div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${session.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{session.status || "Completed"}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-slate-400"><Users size={14} /><span>{session.presentCount || 0}/{session.totalStudents || 0} present</span></div>
                <div className="text-sm font-bold text-cyan-400">{session.attendanceRate || 0}% rate</div>
              </div>
              <button onClick={() => downloadReport(session.lectureSessionId || session._id)} className="btn-secondary text-sm py-2 px-4 w-full flex items-center justify-center gap-2"><Download size={14} /> Download Excel</button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SessionHistory;
