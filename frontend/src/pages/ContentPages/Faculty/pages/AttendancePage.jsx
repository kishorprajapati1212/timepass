import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
// Optional: Install lucide-react for icons, or use the SVG path I provided below
import { Maximize2, Minimize2, XCircle } from "lucide-react";

const AttendancePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [lectureId, setLectureId] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const qrSectionRef = useRef(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get("/faculty/assignments");
        setAssignments(res.data.assignments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  // 🔹 Auto-scroll to QR when lecture starts
  useEffect(() => {
    if (qrToken && qrSectionRef.current && !isFullScreen) {
      qrSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [qrToken, isFullScreen]);

  const getMappingId = () => {
    const match = assignments.find(
      (a) =>
        a.subjectId.toString() === selectedSubject &&
        a.sectionId.toString() === selectedSection,
    );
    return match?._id;
  };

  const startLecture = async () => {
    const mappingId = getMappingId();
    if (!mappingId)
      return toast.error("Please select a valid subject and section.");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const res = await axiosInstance.post("/lecture/start", {
            facultySubjectSectionId: mappingId,
            gpsLocation: { lat: latitude, lng: longitude },
          });
          setLectureId(res.data.lecture._id);
          setQrToken(res.data.lecture.qrToken);
          console.log(res.data);

          toast.success("Lecture started successfully!");
        } catch (err) {
          toast.error("Failed to start lecture.");
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location permission is required."),
    );
  };

  //qr auto refresh every 15 seconds
  useEffect(() => {
    if (!lectureId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/lecture/live-qr/${lectureId}`);
        setQrToken(res.data.qrToken);
        console.log(res.data);
      } catch (err) {
        console.error("QR fetch error", err);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [lectureId]);

  const endLecture = async () => {
    try {
      const { data } = await axiosInstance.post("/lecture/end", {
        lectureSessionId: lectureId,
      });
      toast.info("Lecture ended.");
      console.log(data);

      setLectureId(null);

      setQrToken("");
      setSelectedSubject("");
      setSelectedSection("");
      setIsFullScreen(false);
    } catch (err) {
      toast.error("Error ending lecture.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-6 pt-8 pb-20">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-50 to-slate-400">
        Attendance System
      </h2>

      {/* 🎯 SELECTION CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <label className="text-slate-400 text-sm font-medium">
            Select Subject
          </label>
          <select
            disabled={!!lectureId}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none disabled:opacity-50"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedSection("");
            }}
          >
            <option value="" className="text-slate-500">
              Choose a subject...
            </option>
            {[
              ...new Map(assignments.map((a) => [a.subjectId, a])).values(),
            ].map((a) => (
              <option key={a.subjectId} value={a.subjectId}>
                {a.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-slate-400 text-sm font-medium">
            Select Section
          </label>
          <select
            disabled={!!lectureId}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none disabled:opacity-50"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="" className="text-slate-500">
              Choose a section...
            </option>
            {assignments
              .filter((a) => a.subjectId === selectedSubject)
              .map((a) => (
                <option key={a.sectionId} value={a.sectionId}>
                  {a.sectionName} (Sem {a.sectionSemester})
                </option>
              ))}
          </select>
        </div>

        {!lectureId ? (
          <button
            onClick={startLecture}
            disabled={loading}
            className="mt-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            {loading ? "Starting..." : "Start Lecture"}
          </button>
        ) : (
          <button
            onClick={endLecture}
            className="mt-4 bg-transparent border border-red-500 text-red-400 font-semibold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            End Lecture
          </button>
        )}
      </div>

      {/* 🔳 QR SECTION (STANDARD VIEW) */}
      {qrToken && (
        <div
          ref={qrSectionRef}
          className="flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-xl mt-6 relative group"
        >
          <button
            onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
            title="Full Screen"
          >
            <Maximize2 size={20} />
          </button>

          <h3 className="text-xl text-slate-300 font-medium mb-6">
            Scan QR for Attendance
          </h3>
          <div className="bg-white p-4 rounded-xl shadow-2xl shadow-cyan-500/20">
            <QRCode
              value={JSON.stringify({
                lectureSessionId: lectureId,
                qrToken: qrToken,
              })}
            />
          </div>
          <div className="mt-6 flex items-center space-x-2 text-cyan-400 text-sm animate-pulse">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Live auto-refresh active</span>
          </div>
        </div>
      )}

      {/* 📺 FULLSCREEN OVERLAY */}
      {isFullScreen && (
        <div className="fixed inset-0 z-100 bg-[#020617] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          {/* Top Controls */}
          <div className="absolute top-8 right-8 flex space-x-4">
            <button
              onClick={endLecture}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500/10 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold"
            >
              <XCircle size={20} />
              <span>End Lecture</span>
            </button>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-3 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-all"
            >
              <Minimize2 size={24} />
            </button>
          </div>

          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                Attendance QR
              </h2>
              <p className="text-slate-400 text-xl font-light">
                Subject:{" "}
                {
                  assignments.find((a) => a.subjectId === selectedSubject)
                    ?.subjectName
                }
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] inline-block">
              <QRCode
                value={JSON.stringify({
                  lectureSessionId: lectureId,
                  qrToken: qrToken,
                })}
                size={450}
              />
            </div>

            <div className="flex items-center justify-center space-x-3 text-cyan-400 text-lg">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <span className="font-medium tracking-widest uppercase">
                Live Session Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
