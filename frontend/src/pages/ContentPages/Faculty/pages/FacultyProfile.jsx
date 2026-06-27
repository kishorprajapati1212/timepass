import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/AxiosInstance";

const FacultyProfile = () => {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/faculty/me");
        setFaculty(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("attendx_user");
    navigate("/login");
  };

  const getInitials = (email) => {
    if (!email) return "F";
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium tracking-wide">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/80 backdrop-blur-lg shadow-2xl shadow-cyan-900/10 rounded-2xl w-full max-w-md overflow-hidden border border-slate-800">
        
        {/* Banner Section */}
        <div className="bg-linear-to-r from-blue-600 to-cyan-500 h-24 w-full"></div>

        <div className="px-8 pb-8 relative">
          {/* Profile Avatar */}
          <div className="flex justify-center -mt-12 mb-4">
            <div className="h-24 w-24 bg-slate-900 rounded-full p-1.5 shadow-lg">
              <div className="h-full w-full bg-slate-800 text-cyan-400 flex items-center justify-center text-3xl font-bold rounded-full border border-slate-700">
                {getInitials(faculty?.userId?.email)}
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-50">Faculty Profile</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your account details</p>
          </div>

          {/* Information List */}
          <div className="bg-slate-800/50 rounded-xl p-5 space-y-4 border border-slate-700/50">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400 text-sm font-medium">Employee ID</span>
              <span className="text-slate-100 font-semibold">{faculty?.employeeId || "—"}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400 text-sm font-medium">Email Address</span>
              <span className="text-slate-100 font-semibold">{faculty?.userId?.email || "—"}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Department</span>
              <span className="text-slate-100 font-semibold">{faculty?.departmentId?.name || "—"}</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center bg-transparent border border-red-500/50 text-red-400 font-semibold py-2.5 rounded-xl hover:bg-red-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;