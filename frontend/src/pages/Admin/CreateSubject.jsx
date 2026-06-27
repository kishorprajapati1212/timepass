import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import axiosInstance from "../../utils/axios.js";

const CreateSubject = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try { await axiosInstance.post("/subject/create", data); toast.success("Subject created successfully!"); navigate("/admin"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to create subject"); }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-50 p-4">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-lg mx-auto pt-6">
        <Link to="/admin" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm"><ArrowLeft size={16} className="mr-1" /> Back to Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3"><BookOpen size={28} className="text-blue-400" /></div>
            <h2 className="text-2xl font-bold">Create Subject</h2>
            <p className="text-slate-400 text-sm mt-1">Add a new subject to the system</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject Name</label><input {...register("name", { required: "Required" })} className="input-field" placeholder="e.g. Data Structures" />{errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}</div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject Code</label><input {...register("code", { required: "Required" })} className="input-field" placeholder="e.g. CS201" />{errors.code && <p className="text-rose-400 text-xs mt-1">{errors.code.message}</p>}</div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Credits</label><input type="number" {...register("credits", { required: "Required" })} className="input-field" placeholder="3" /></div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label><textarea {...register("description")} className="input-field min-h-[100px]" placeholder="Brief description..." /></div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> Create Subject</>}</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default CreateSubject;
