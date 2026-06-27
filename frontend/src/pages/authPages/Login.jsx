import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/AxiosInstance";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion"; // For entry animations

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const endpoint = `/${role}/login`;
      const res = await axios.post(endpoint, {
        email: data.email,
        password: data.password,
      });

      const userData = {
        token: res.data.token,
        user: {
          role: role,
          id: role === "student" ? res.data.student._id : res.data.user.id,
          name: role === "student" ? res.data.student.name : res.data.user.name,
          email: role === "student" ? res.data.student.email : res.data.user.email,
        },
      };

      localStorage.setItem("attendx_user", JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.user.name || role}!`);
      navigate(`/${role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center overflow-hidden font-sans">
      {/* Dynamic Background Blobs */}
      <div className="pointer-events-none absolute top-[-5%] left-[-5%] w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-5%] right-[-5%] w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md p-10 bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter flex items-center justify-center gap-2">
            Attend<span className="text-cyan-400">X</span>
          </h1>
          <p className="text-slate-300 mt-3 text-base font-medium opacity-80">
            Smart Attendance Management
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selector */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-slate-200 uppercase tracking-widest mb-2 ml-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-lg text-slate-100 cursor-pointer appearance-none"
            >
              <option value="student" className="bg-slate-900">Student</option>
              <option value="faculty" className="bg-slate-900">Faculty</option>
              <option value="admin" className="bg-slate-900">Admin</option>
            </select>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-slate-200 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              {...register("email", { required: "Email is required" })}
              className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-lg placeholder:text-slate-500"
            />
            {errors.email && <p className="text-red-400 text-xs mt-2 ml-2 font-medium">{errors.email.message}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-slate-200 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-lg placeholder:text-slate-500"
            />
            {errors.password && <p className="text-red-400 text-xs mt-2 ml-2 font-medium">{errors.password.message}</p>}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-cyan-900/30 transition-all mt-4 uppercase text-sm tracking-widest"
          >
            Login as {role}
          </motion.button>
        </form>
        
        <motion.div variants={itemVariants} className="mt-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-bold group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}