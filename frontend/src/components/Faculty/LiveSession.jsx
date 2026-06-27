import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Play, Square, Users, Clock, BookOpen, ChevronRight } from "lucide-react";
import axiosInstance from "../../utils/axios.js";
import QRGenerator from "./QRGenerator.jsx";

const LiveSession = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => { fetchAssignments(); }, []);

  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - new Date(activeSession.startTime || activeSession.createdAt).getTime()) / 1000));
        fetchAttendanceStatus();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const res = await axiosInstance.get("/faculty/assignments");
      const data = res.data?.data || res.data || [];
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) { toast.error("Failed to load assignments"); }
    finally { setLoadingAssignments(false); }
  };

  const fetchAttendanceStatus = async () => {
    if (!activeSession) return;
    try {
      const res = await axiosInstance.get(`/lecture/${activeSession.lectureSessionId || activeSession._id}`);
      const data = res.data?.data || res.data || {};
      setAttendanceList(Array.isArray(data.attendance) ? data.attendance : []);
    } catch (err) { console.error(err); }
  };

  const startSession = async () => {
    if (!selectedAssignment) { toast.error("Please select a subject"); return; }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/lecture/start", {
        subjectId: selectedAssignment.subjectId?._id || selectedAssignment.subjectId,
        sectionId: selectedAssignment.sectionId?._id || selectedAssignment.sectionId,
      });
      setActiveSession(res.data?.data || res.data);
      toast.success("Session started!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to start session"); }
    finally { setLoading(false); }
  };

  const endSession = async () => {
    if (!activeSession) return;
    setLoading(true);
    try {
      await axiosInstance.post("/lecture/end", { lectureSessionId: activeSession.lectureSessionId || activeSession._id });
      toast.success("Session ended!");
      setActiveSession(null); setElapsedTime(0); setAttendanceList([]);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to end session"); }
    finally { setLoading(false); }
  };

  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`; };

  // Helper to get display name from nested or flat data
  const getSubjectName = (a) => a.subjectId?.name || a.subjectName || a.subject?.name || "Unknown Subject";
  const getSectionName = (a) => a.sectionId?.name || a.sectionName || a.section?.name || "Unknown Section";

  if (activeSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Session</h2>
          <button onClick={endSession} disabled={loading} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"><Square size={14} /> End Session</button>
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><Clock size={20} className="text-cyan-400" /><div><p className="text-xs text-slate-400">Duration</p><p className="text-xl font-mono font-bold">{formatTime(elapsedTime)}</p></div></div>
          <div className="flex items-center gap-3"><Users size={20} className="text-emerald-400" /><div><p className="text-xs text-slate-400">Present</p><p className="text-xl font-bold">{attendanceList.length}</p></div></div>
        </div>
        <QRGenerator lectureSessionId={activeSession.lectureSessionId || activeSession._id} onRefresh={() => {}} />
        <div className="glass-card p-4">
          <h3 className="font-bold mb-3">Present Students ({attendanceList.length})</h3>
          {attendanceList.length === 0 ? <p className="text-slate-500 text-sm text-center py-4">No students marked yet</p> : (
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {attendanceList.map((record, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">{record.studentName?.charAt(0) || "S"}</div>
                  <div className="flex-1"><p className="text-sm font-medium">{record.studentName || "Student"}</p><p className="text-xs text-slate-500">{record.rollNumber || ""}</p></div>
                  <span className="text-xs text-emerald-400 font-medium">Present</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Start Session</h2>
      <div className="glass-card p-5">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Subject / Section</label>
        {loadingAssignments ? (
          <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" /></div>
        ) : assignments.length === 0 ? (
          <p className="text-slate-500 text-sm">No assignments found. Contact admin.</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment, i) => (
              <button key={i} onClick={() => setSelectedAssignment(assignment)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left ${selectedAssignment === assignment ? "border-cyan-500/50 bg-cyan-500/10" : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"><BookOpen size={18} className="text-cyan-400" /></div>
                  <div><p className="font-medium text-sm">{getSubjectName(assignment)}</p><p className="text-xs text-slate-500">{getSectionName(assignment)}</p></div>
                </div>
                <ChevronRight size={16} className={selectedAssignment === assignment ? "text-cyan-400" : "text-slate-600"} />
              </button>
            ))}
          </div>
        )}
      </div>
      <button onClick={startSession} disabled={loading || !selectedAssignment} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Play size={18} /> Start Lecture Session</>}
      </button>
    </div>
  );
};
export default LiveSession;
