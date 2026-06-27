import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { Maximize2, Minimize2, XCircle, Play, Square, Clock } from "lucide-react";

const AttendancePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [topic, setTopic] = useState("");
  const [lectureId, setLectureId] = useState(null);
  const [qrData, setQrData] = useState("");
  const [qrExpiresAt, setQrExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const qrSectionRef = useRef(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get("/faculty/assignments");
        setAssignments(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load assignments");
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (!qrExpiresAt) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(qrExpiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) refreshQR();
    }, 1000);
    return () => clearInterval(interval);
  }, [qrExpiresAt]);

  const getSubjectName = () => {
    const subj = assignments.find(a => a.subjectId?._id === selectedSubject || a.subjectId === selectedSubject);
    return subj?.subjectId?.subjectName || subj?.subjectName || "Unknown";
  };

  const getSectionName = () => {
    const sec = assignments.find(a => a.sectionId?._id === selectedSection || a.sectionId === selectedSection);
    return sec?.sectionId?.name || sec?.sectionName || "Unknown";
  };

  const startLecture = async () => {
    if (!selectedSubject || !selectedSection || !topic.trim()) {
      return toast.error("Please select subject, section and enter topic.");
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          const res = await axiosInstance.post("/lecture/start", {
            subjectId: selectedSubject,
            sectionId: selectedSection,
            topic: topic.trim(),
            description: "",
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            attendanceWindow: 15,
          });
          const lecture = res.data.data;
          setLectureId(lecture.lectureSessionId);
          setQrData(lecture.qrCode);
          setQrExpiresAt(lecture.qrExpiresAt);
          setTimeLeft(300);
          toast.success("Lecture started successfully!");
          setTimeout(() => qrSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to start lecture");
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location permission is required.")
    );
  };

  const refreshQR = async () => {
    if (!lectureId) return;
    try {
      const res = await axiosInstance.get(`/lecture/live-qr/${lectureId}`);
      setQrData(res.data.data.qrCode);
      setQrExpiresAt(res.data.data.qrExpiresAt);
      setTimeLeft(Math.max(0, res.data.data.timeRemaining || 300));
    } catch (err) {
      console.error("QR refresh error", err);
    }
  };

  const endLecture = async () => {
    if (!lectureId) return;
    try {
      await axiosInstance.post("/lecture/end", { lectureSessionId: lectureId });
      toast.success("Lecture ended successfully");
      setLectureId(null); setQrData(""); setQrExpiresAt(null); setTimeLeft(0);
      setIsFullScreen(false); setSelectedSubject(""); setSelectedSection(""); setTopic("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error ending lecture");
    }
  };

  const uniqueSubjects = [...new Map(assignments.map(a => [a.subjectId?._id || a.subjectId, a])).values()];

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-6 pt-8 pb-20">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-50 to-slate-400 flex items-center gap-3">
        <Clock size={28} /> Attendance System
      </h2>
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col space-y-4">
        <div>
          <label className="text-slate-400 text-sm font-medium">Select Subject</label>
          <select disabled={!!lectureId} value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setSelectedSection(""); }}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none disabled:opacity-50 mt-1">
            <option value="">Choose a subject...</option>
            {uniqueSubjects.map((a) => (
              <option key={a.subjectId?._id || a.subjectId} value={a.subjectId?._id || a.subjectId}>
                {a.subjectId?.subjectName || a.subjectName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Select Section</label>
          <select disabled={!!lectureId} value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none disabled:opacity-50 mt-1">
            <option value="">Choose a section...</option>
            {assignments.filter((a) => (a.subjectId?._id || a.subjectId) === selectedSubject).map((a) => (
              <option key={a.sectionId?._id || a.sectionId} value={a.sectionId?._id || a.sectionId}>
                {a.sectionId?.name || a.sectionName} (Sem {a.sectionId?.semester || a.sectionSemester})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Lecture Topic</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} disabled={!!lectureId}
            placeholder="e.g. Introduction to Data Structures"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 mt-1" />
        </div>
        {!lectureId ? (
          <button onClick={startLecture} disabled={loading}
            className="mt-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
            <Play size={18} /> {loading ? "Starting..." : "Start Lecture"}
          </button>
        ) : (
          <button onClick={endLecture}
            className="mt-4 bg-transparent border border-red-500 text-red-400 font-semibold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
            <Square size={18} /> End Lecture
          </button>
        )}
      </div>
      {qrData && (
        <div ref={qrSectionRef} className="flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-xl mt-6 relative group">
          <button onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Full Screen">
            <Maximize2 size={20} />
          </button>
          <h3 className="text-xl text-slate-300 font-medium mb-2">Scan QR for Attendance</h3>
          <p className="text-slate-500 text-sm mb-6">{getSubjectName()} &bull; {getSectionName()}</p>
          <div className="bg-white p-4 rounded-xl shadow-2xl shadow-cyan-500/20">
            <QRCode value={qrData} size={200} />
          </div>
          <div className="mt-6 flex items-center space-x-3 text-cyan-400 text-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Live &bull; Refreshes in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
        </div>
      )}
      {isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute top-8 right-8 flex space-x-4">
            <button onClick={endLecture}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500/10 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold">
              <XCircle size={20} /> <span>End Lecture</span>
            </button>
            <button onClick={() => setIsFullScreen(false)}
              className="p-3 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-all">
              <Minimize2 size={24} />
            </button>
          </div>
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white tracking-tight">Attendance QR</h2>
              <p className="text-slate-400 text-xl font-light">{getSubjectName()} &bull; {getSectionName()}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] inline-block">
              <QRCode value={qrData} size={450} />
            </div>
            <div className="flex items-center justify-center space-x-3 text-cyan-400 text-lg">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <span className="font-medium tracking-widest uppercase">Live Session Active</span>
            </div>
            <p className="text-slate-500">Refreshes in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
