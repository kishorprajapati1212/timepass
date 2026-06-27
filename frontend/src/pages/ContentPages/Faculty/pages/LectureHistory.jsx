import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";
import { Calendar, Users, BookOpen } from "lucide-react";

const LectureHistory = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/api/report/faculty/dashboard");
        setLectures(res.data.data.recentLectures || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pt-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-50 to-slate-400 mb-8">
        Lecture History
      </h1>
      {loading ? (
        <div className="flex items-center space-x-3 text-cyan-500">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading lectures...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {lectures.map((lec) => (
            <div key={lec.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{lec.topic}</h3>
                  <p className="text-slate-400 text-sm">{lec.subject} &bull; {lec.section}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(lec.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Users size={14} /> {lec.presentCount} present</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${lec.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                  {lec.status}
                </span>
              </div>
            </div>
          ))}
          {lectures.length === 0 && <p className="text-slate-500 text-center py-12">No lectures found.</p>}
        </div>
      )}
    </div>
  );
};

export default LectureHistory;
