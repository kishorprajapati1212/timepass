import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, UserPlus, GraduationCap, UserCog, Shield } from "lucide-react";
import axiosInstance from "../../utils/axios.js";

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [role, setRole] = useState("student");
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [secRes, depRes] = await Promise.all([
          axiosInstance.get("/sections"),
          axiosInstance.get("/departments"),
        ]);
        // Handle various response structures
        const secData = secRes.data?.data || secRes.data || [];
        const depData = depRes.data?.data || depRes.data || [];
        setSections(Array.isArray(secData) ? secData : []);
        setDepartments(Array.isArray(depData) ? depData : []);
      } catch (err) { console.error("Failed to load initial data", err); }
      finally { setLoadingData(false); }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      let payload = { ...data, role };
      let endpoint = `/${role}/create`;
      if (role === "student") payload.name = `${data.firstName} ${data.lastName}`;
      await axiosInstance.post(endpoint, payload);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
      navigate("/login");
    } catch (err) { toast.error(err.response?.data?.message || err.message || "Registration failed"); }
  };

  const roleConfig = { student: { icon: GraduationCap, label: "Student", color: "cyan" }, faculty: { icon: UserCog, label: "Faculty", color: "blue" }, admin: { icon: Shield, label: "Admin", color: "purple" } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.08 }} className="w-full max-w-lg relative z-10">
        <motion.div variants={itemVariants} className="mb-4">
          <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors text-sm"><ArrowLeft size={16} className="mr-1" /> Back to Login</Link>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black tracking-tight mb-1">Create <span className="text-gradient">Account</span></h1>
            <p className="text-slate-400 text-sm">Register a new user in the system</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon; const isActive = role === key;
              return (
                <button key={key} type="button" onClick={() => setRole(key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-300 ${isActive ? `border-${config.color}-500/50 bg-${config.color}-500/10 text-${config.color}-400` : "border-slate-700/50 bg-slate-800/40 text-slate-500 hover:border-slate-600"}`}>
                  <Icon size={18} /><span className="text-xs font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">First Name</label><input {...register("firstName", { required: "Required" })} className="input-field" placeholder="John" />{errors.firstName && <p className="text-rose-400 text-xs mt-1">{errors.firstName.message}</p>}</div>
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Name</label><input {...register("lastName", { required: "Required" })} className="input-field" placeholder="Doe" />{errors.lastName && <p className="text-rose-400 text-xs mt-1">{errors.lastName.message}</p>}</div>
              </div>
            )}
            {role !== "student" && (
              <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label><input {...register("name", { required: "Name is required" })} className="input-field" placeholder="Enter full name" />{errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}</div>
            )}
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</label><input type="email" {...register("email", { required: "Email is required" })} className="input-field" placeholder="user@example.com" />{errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}</div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label><input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })} className="input-field" placeholder="Min 6 characters" />{errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}</div>
            {role === "student" && (
              <>
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Roll Number</label><input {...register("rollNumber", { required: "Required" })} className="input-field" placeholder="e.g. 2023001" /></div>
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Section</label>
                  <select {...register("section", { required: "Required" })} className="input-field">
                    <option value="">{loadingData ? "Loading..." : "Select Section"}</option>
                    {sections.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name || s.sectionName || s._id}</option>)}
                  </select>
                </div>
              </>
            )}
            {role === "faculty" && (
              <>
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select {...register("department", { required: "Required" })} className="input-field">
                    <option value="">{loadingData ? "Loading..." : "Select Department"}</option>
                    {departments.map(d => <option key={d._id || d.id} value={d._id || d.id}>{d.name || d.departmentName || d._id}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Employee ID</label><input {...register("employeeId", { required: "Required" })} className="input-field" placeholder="e.g. FAC001" /></div>
              </>
            )}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Register;
