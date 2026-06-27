import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Optional: if you have lucide-react
import axios from "../../../utils/AxiosInstance";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [role, setRole] = useState("student");
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secRes, facRes, depRes] = await Promise.all([
          axios.get("/sections"),
          axios.get("/faculty"),
          axios.get("/departments"),
        ]);
        setSections(secRes.data);
        setFaculty(facRes.data);
        setDepartments(depRes.data);
      } catch (err) {
        toast.error("Failed to load initial data");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      let payload = { ...data, role };
      let endpoint = `/${role}/create`;

      if (role === "student") {
        payload.name = `${data.firstName} ${data.lastName}`;
      }

      await axios.post(endpoint, payload);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} registered! 🚀`);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // Consistent Styling Classes
  const inputBg = "bg-slate-800/40 border-slate-700/50 focus:border-cyan-500/50 focus:ring-cyan-500/20";
  const labelStyle = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1";
  const sharedInputClass = `w-full p-3 rounded-xl border text-slate-200 placeholder-slate-500 transition-all outline-none ${inputBg}`;
  const errorClass = "text-red-400 text-xs mt-1 ml-2 font-medium";

  return (
    <div className="relative min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Back Link */}
        <Link 
          to="/admin" 
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Card Container */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-slate-400 mt-2 text-sm">Fill in the details to register a new user</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Role Selector */}
              <div>
                <label className={labelStyle}>Identity Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${sharedInputClass} cursor-pointer hover:bg-slate-800/60`}
                >
                  <option className="bg-slate-900" value="student">Student</option>
                  <option className="bg-slate-900" value="faculty">Faculty</option>
                  <option className="bg-slate-900" value="admin">Administrator</option>
                </select>
              </div>

              {/* Dynamic Name Fields */}
              {role !== "student" ? (
                <div>
                  <label className={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Doe"
                    {...register("name", { required: "Name is required" })}
                    className={sharedInputClass}
                  />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      {...register("firstName", { required: "Required" })}
                      className={sharedInputClass}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register("lastName", { required: "Required" })}
                      className={sharedInputClass}
                    />
                  </div>
                </div>
              )}

              {/* Email & Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    placeholder="email@university.edu"
                    {...register("email", { required: "Email is required" })}
                    className={sharedInputClass}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "Required" })}
                    className={sharedInputClass}
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label className={labelStyle}>Mobile Number</label>
                <input
                  type="text"
                  placeholder="+1 234 567 890"
                  {...register("mobileNumber", { required: "Mobile is required" })}
                  className={sharedInputClass}
                />
              </div>

              {/* Section Separator */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f172a] px-2 text-slate-500 font-bold">Role Specific Info</span></div>
              </div>

              {/* Student Specifics */}
              {role === "student" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Enrollment No</label>
                      <input type="text" {...register("enrollmentNo", { required: true })} className={sharedInputClass} />
                    </div>
                    <div>
                      <label className={labelStyle}>Date of Birth</label>
                      <input type="date" {...register("dob", { required: true })} className={`${sharedInputClass} scheme-dark`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Section</label>
                      <select {...register("sectionId")} className={sharedInputClass}>
                        <option value="">Select</option>
                        {sections.map(s => <option key={s._id} value={s._id} className="bg-slate-900">{s.semester} - {s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelStyle}>Mentor</label>
                      <select {...register("mentorFacultyId")} className={sharedInputClass}>
                        <option value="">Select</option>
                        {faculty.map(f => <option key={f._id} value={f._id} className="bg-slate-900">{f.userId?.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Faculty Specifics */}
              {role === "faculty" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Employee ID</label>
                    <input type="text" {...register("employeeId", { required: true })} className={sharedInputClass} />
                  </div>
                  <div>
                    <label className={labelStyle}>Department</label>
                    <select {...register("departmentId", { required: true })} className={sharedInputClass}>
                      <option value="">Select</option>
                      {departments.map(d => <option key={d._id} value={d._id} className="bg-slate-900">{d.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.98]"
              >
                Register {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}