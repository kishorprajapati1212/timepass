import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, LayoutGrid, Plus } from "lucide-react";
import axiosInstance from "../../utils/axios.js";

const CreateSection = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try { await axiosInstance.post("/section/create", data); toast.success("Section created successfully!"); navigate("/admin"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to create section"); }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50 p-4">
      <div className="relative z-10 max-w-lg mx-auto pt-6">
        <Link to="/admin" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm"><ArrowLeft size={16} className="mr-1" /> Back to Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3"><LayoutGrid size={28} className="text-amber-400" /></div>
            <h2 className="text-2xl font-bold">Create Section</h2>
            <p className="text-slate-400 text-sm mt-1">Add a new class section</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Section Name</label><input {...register("name", { required: "Required" })} className="input-field" placeholder="e.g. Section A" />{errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}</div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Year</label><input type="number" {...register("year", { required: "Required" })} className="input-field" placeholder="e.g. 2024" /></div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Capacity</label><input type="number" {...register("capacity")} className="input-field" placeholder="e.g. 60" /></div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> Create Section</>}</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default CreateSection;
