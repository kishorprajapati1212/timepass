import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff, LogIn, Shield, GraduationCap, UserCog } from "lucide-react";
import axiosInstance from "../../utils/axios.js";
import { login } from "../../store/authSlice.js";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleConfig = {
    student: { icon: GraduationCap, label: "Student", color: "cyan" },
    faculty: { icon: UserCog, label: "Faculty", color: "blue" },
    admin: { icon: Shield, label: "Admin", color: "purple" },
  };

  const onSubmit = async (data) => {
    try {
      const endpoint = `/${role}/login`;
      const res = await axiosInstance.post(endpoint, { email: data.email, password: data.password });
      const payload = res.data?.data || res.data;
      const userData = {
        token: payload.token,
        user: { role, id: payload._id || payload.id, name: payload.name, email: payload.email },
      };
      dispatch(login(userData));
      toast.success(`Welcome back, ${payload.name || role}!`);
      navigate(`/${role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md relative z-10">
        <motion.div variants={itemVariants} className="glass-card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight mb-2">Attend<span className="text-cyan-400">X</span></h1>
            <p className="text-slate-400">Smart Attendance Management</p>
          </div>
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleConfig).map(([key, config]) => {
                const Icon = config.icon; const isActive = role === key;
                return (
                  <button key={key} type="button" onClick={() => setRole(key)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-300 ${isActive ? `border-${config.color}-500/50 bg-${config.color}-500/10 text-${config.color}-400` : "border-slate-700/50 bg-slate-800/40 text-slate-500 hover:border-slate-600"}`}>
                    <Icon size={20} /><span className="text-xs font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="input-field" placeholder="Enter your email" />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} className="input-field pr-12" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
              </button>
            </motion.div>
          </form>
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-slate-500 text-sm">Don&apos;t have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Register here</Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Login;
