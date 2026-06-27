import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

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
      const secRes = await axios.get("/sections");
      const facRes = await axios.get("/faculty");
      const depRes = await axios.get("/departments");

      setSections(secRes.data);
      setFaculty(facRes.data);
      setDepartments(depRes.data);
      console.log(facRes.data);
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    console.log("Register Data:", { ...data, role });

    try {
      if (role === "student") {
        const fullName = `${data.firstName} ${data.lastName}`;
        const payload = {
          ...data,
          name: fullName,
          role,
        };

        await axios.post("/student/create", payload);
        toast.success("Student registered successfully 🚀");
      } else if (role === "faculty") {
        await axios.post("/faculty/create", { ...data, role });
        toast.success("Faculty registered successfully 🚀");
      } else {
        await axios.post("/admin/create", { ...data, role });
        toast.success("Admin registered successfully 🚀");
      }

      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  // Shared classes for consistent styling
  const sharedInputClass =
    "w-full mt-1 p-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all";
  
  const errorClass = "text-red-400 text-xs mt-1 ml-1";

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 overflow-hidden flex items-center justify-center selection:bg-cyan-500/30 py-10">
      
      {/* GLOBAL STYLE TO KILL SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />

      {/* REGISTRATION CARD */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selector */}
          <div>
            <label className="text-sm font-medium text-slate-300">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`${sharedInputClass} [&>option]:bg-slate-900`}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* NAME FOR FACULTY & ADMIN */}
          {role !== "student" && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className={sharedInputClass}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
          )}

          {/* COMMON FIELDS */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className={sharedInputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className={sharedInputClass}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Mobile Number"
              {...register("mobileNumber", { required: "Mobile is required" })}
              className={sharedInputClass}
            />
          </div>

          {/* ================= STUDENT ================= */}
          {role === "student" && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Enrollment No"
                {...register("enrollmentNo", { required: true })}
                className={sharedInputClass}
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: true })}
                  className={sharedInputClass}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: true })}
                  className={sharedInputClass}
                />
              </div>

              <input
                type="date"
                {...register("dob", { required: true })}
                className={`${sharedInputClass} scheme-dark`}
              />

              <select {...register("sectionId")} className={`${sharedInputClass} [&>option]:bg-slate-900`}>
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec._id} value={sec._id}>
                    {sec.semester} - {sec.name}
                  </option>
                ))}
              </select>

              <select {...register("mentorFacultyId")} className={`${sharedInputClass} [&>option]:bg-slate-900`}>
                <option value="">Select Mentor</option>
                {faculty.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.employeeId} - {fac.userId?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ================= FACULTY ================= */}
          {role === "faculty" && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Employee ID"
                {...register("employeeId", { required: true })}
                className={sharedInputClass}
              />

              <select
                {...register("departmentId", { required: true })}
                className={`${sharedInputClass} [&>option]:bg-slate-900`}
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          <p className="text-sm text-center text-slate-400 mt-4">
            Back To Dashboard?{" "}
            <Link to="/admin" className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}