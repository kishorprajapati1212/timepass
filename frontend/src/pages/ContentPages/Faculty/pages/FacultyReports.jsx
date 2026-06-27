import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";
import { toast } from "react-toastify";
import { FileDown, CloudUpload, FileText, Download } from "lucide-react";

const FacultyReports = () => {
  const [reports, setReports] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [repRes, lecRes] = await Promise.all([
          axiosInstance.get("/api/report/saved-reports"),
          axiosInstance.get("/api/report/faculty/dashboard"),
        ]);
        setReports(repRes.data.data || []);
        setLectures(lecRes.data.data.recentLectures || []);
      } catch (err) {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDownload = (lectureId) => {
    window.open(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/report/lecture/${lectureId}/download`, "_blank");
  };

  const handleUpload = async (lectureId) => {
    try {
      await axiosInstance.post(`/api/report/lecture/${lectureId}/upload`);
      toast.success("Report uploaded to cloud");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="pt-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-50 to-slate-400 mb-8">
        Reports & Downloads
      </h1>
      <div className="grid gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={20} className="text-cyan-400" /> Recent Lectures</h2>
          {lectures.length === 0 ? (
            <p className="text-slate-500">No lectures available.</p>
          ) : (
            <div className="space-y-3">
              {lectures.map((lec) => (
                <div key={lec.id} className="flex items-center justify-between bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                  <div>
                    <p className="font-semibold text-slate-100">{lec.topic}</p>
                    <p className="text-slate-400 text-sm">{lec.subject} &bull; {lec.section}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload(lec.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all text-sm font-medium">
                      <Download size={16} /> Excel
                    </button>
                    <button onClick={() => handleUpload(lec.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-all text-sm font-medium">
                      <CloudUpload size={16} /> Cloud
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileDown size={20} className="text-purple-400" /> Saved Cloud Reports</h2>
          {reports.length === 0 ? (
            <p className="text-slate-500">No saved reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r._id} className="flex items-center justify-between bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                  <div>
                    <p className="font-semibold text-slate-100">{r.fileName || "Report"}</p>
                    <p className="text-slate-400 text-sm">
                      {r.summary?.present}/{r.summary?.totalStudents} present &bull; {r.summary?.attendanceRate}% rate
                    </p>
                  </div>
                  <a href={r.cloudinaryUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all text-sm font-medium">
                    <Download size={16} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyReports;
