import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, UserCheck, Plus, Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axios.js";

const AssignFaculty = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [fRes, sRes, secRes] = await Promise.all([
          axiosInstance.get("/faculty"),
          axiosInstance.get("/subjects"),
          axiosInstance.get("/sections"),
        ]);
        // Handle various response structures from backend
        const fData = fRes.data?.data || fRes.data || [];
        const sData = sRes.data?.data || sRes.data || [];
        const secData = secRes.data?.data || secRes.data || [];

        setFaculty(Array.isArray(fData) ? fData : []);
        setSubjects(Array.isArray(sData) ? sData : []);
        setSections(Array.isArray(secData) ? secData : []);
      } catch (err) { 
        console.error("Fetch error:", err);
        toast.error("Failed to load data"); 
      }
      finally { setLoadingData(false); }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try { 
      await axiosInstance.post("/faculty-subject-section", data); 
      toast.success("Faculty assigned successfully!"); 
      navigate("/admin"); 
    }
    catch (err) { 
      toast.error(err.response?.data?.message || "Assignment failed"); 
    }
  };

  // Helper to safely get display text
  const getFacultyLabel = (f) => `${f.name || "Unnamed"} ${f.email ? "(" + f.email + ")" : ""}`;
  const getSubjectLabel = (s) => `${s.name || s.subjectName || "Unnamed"} ${s.code ? "(" + s.code + ")" : ""}`;
  const getSectionLabel = (s) => s.name || s.sectionName || s._id || "Unnamed";

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50 p-4">
      <div className="relative z-10 max-w-lg mx-auto pt-6">
        <Link to="/admin" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm"><ArrowLeft size={16} className="mr-1" /> Back to Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3"><UserCheck size={28} className="text-emerald-400" /></div>
            <h2 className="text-2xl font-bold">Assign Faculty</h2>
            <p className="text-slate-400 text-sm mt-1">Assign faculty to subjects and sections</p>
          </div>

          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 size={32} className="text-cyan-400 animate-spin mb-3" />
              <p className="text-slate-400 text-sm">Loading data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Faculty ({faculty.length} available)</label>
                <select {...register("facultyId", { required: "Required" })} className="input-field">
                  <option value="">Select Faculty</option>
                  {faculty.map((f) => (
                    <option key={f._id || f.id} value={f._id || f.id}>{getFacultyLabel(f)}</option>
                  ))}
                </select>
                {faculty.length === 0 && <p className="text-amber-400 text-xs mt-1">No faculty found. Create faculty first.</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject ({subjects.length} available)</label>
                <select {...register("subjectId", { required: "Required" })} className="input-field">
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>{getSubjectLabel(s)}</option>
                  ))}
                </select>
                {subjects.length === 0 && <p className="text-amber-400 text-xs mt-1">No subjects found. Create subjects first.</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Section ({sections.length} available)</label>
                <select {...register("sectionId", { required: "Required" })} className="input-field">
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>{getSectionLabel(s)}</option>
                  ))}
                </select>
                {sections.length === 0 && <p className="text-amber-400 text-xs mt-1">No sections found. Create sections first.</p>}
              </div>

              <button type="submit" disabled={isSubmitting || faculty.length === 0 || subjects.length === 0 || sections.length === 0} className="btn-primary w-full flex items-center justify-center gap-2">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> Assign Faculty</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default AssignFaculty;
