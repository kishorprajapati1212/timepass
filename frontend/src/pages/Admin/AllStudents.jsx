import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, Users, Search, GraduationCap } from "lucide-react";
import axiosInstance from "../../utils/axios.js";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(students.filter(s => (s.name?.toLowerCase().includes(term)) || (s.email?.toLowerCase().includes(term)) || (s.rollNumber?.toLowerCase().includes(term))));
  }, [search, students]);

  const fetchStudents = async () => {
    try { const res = await axiosInstance.get("/students"); const data = res.data?.data || res.data || []; setStudents(Array.isArray(data) ? data : []); setFiltered(Array.isArray(data) ? data : []); }
    catch (err) { toast.error("Failed to load students"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50 p-4">
      <div className="relative z-10 max-w-4xl mx-auto pt-6">
        <Link to="/admin" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm"><ArrowLeft size={16} className="mr-1" /> Back to Dashboard</Link>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Users size={24} className="text-cyan-400" /> All Students</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="input-field pl-10 py-2 text-sm w-64" />
          </div>
        </div>
        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" /></div> : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center"><GraduationCap size={48} className="mx-auto text-slate-600 mb-3" /><p className="text-slate-400">No students found.</p></div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((student, i) => (
              <motion.div key={student._id || student.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold">{student.name?.charAt(0)?.toUpperCase() || "S"}</div>
                <div className="flex-1"><p className="font-medium text-sm">{student.name || "Unnamed"}</p><p className="text-xs text-slate-500">{student.email || "No email"} &bull; {student.rollNumber || "No roll"}</p></div>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">{student.section?.name || student.sectionName || student.section || "N/A"}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AllStudents;
