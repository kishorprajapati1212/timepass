import { useSelector } from "react-redux";
import { Mail, Shield, BookOpen } from "lucide-react";

const FacultyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="glass-card p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">{user?.name?.charAt(0)?.toUpperCase() || "F"}</div>
        <h3 className="text-xl font-bold">{user?.name || "Faculty Name"}</h3>
        <p className="text-cyan-400 text-sm font-medium mt-1">Faculty Member</p>
      </div>
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40"><Mail size={18} className="text-cyan-400" /><div><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium">{user?.email || "Not available"}</p></div></div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40"><Shield size={18} className="text-purple-400" /><div><p className="text-xs text-slate-500">Role</p><p className="text-sm font-medium capitalize">{user?.role || "faculty"}</p></div></div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40"><BookOpen size={18} className="text-emerald-400" /><div><p className="text-xs text-slate-500">ID</p><p className="text-sm font-medium">{user?.id || "Not available"}</p></div></div>
      </div>
    </div>
  );
};
export default FacultyProfile;
