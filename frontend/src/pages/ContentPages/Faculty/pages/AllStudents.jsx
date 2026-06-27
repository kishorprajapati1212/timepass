import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get("/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="pt-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-slate-50 to-slate-400">
        All Students
      </h1>

      {loading ? (
        <div className="flex items-center space-x-3 text-cyan-500">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading students...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 shadow-xl bg-slate-900/50 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-slate-700">Enrollment No</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700">First Name</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700">Last Name</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700">Email</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-slate-200">{student.enrollmentNo}</td>
                  <td className="px-6 py-4">{student.firstName}</td>
                  <td className="px-6 py-4">{student.lastName}</td>
                  <td className="px-6 py-4 text-slate-400">{student.userId?.email}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllStudents;