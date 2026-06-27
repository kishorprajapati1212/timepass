import React, { useState } from "react";
import { User, Home, QrCode, Bell, Settings } from "lucide-react";
import QRScanner from "../../../components/Student/QRScanner"; // We will create this next

const Student = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Mock user data - normally from your Auth context/Redux
  const user = {
    name: "RK Coder",
    id: "STU101",
    email: "rk.coder@university.edu",
    attendance: "85%",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Welcome back, {user.name.split(' ')[0]}!</h2>
            {/* Creativity: Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Attendance</p>
                <p className="text-2xl font-bold text-cyan-400">{user.attendance}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-2xl font-bold text-green-400">Active</p>
              </div>
            </div>
            
            <div className="mt-6 bg-linear-to-br from-indigo-600 to-cyan-600 p-6 rounded-3xl shadow-lg shadow-cyan-900/20">
              <h3 className="font-bold text-lg">Next Lecture: OS</h3>
              <p className="text-white/80">Room 402 • 10:30 AM</p>
              <button className="mt-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium">
                View Schedule
              </button>
            </div>
          </div>
        );
      case "qr":
        return <QRScanner onBack={() => setActiveTab("home")} />;
      case "profile":
        return (
          <div className="p-6 flex flex-col items-center animate-in slide-in-from-bottom-4">
            <div className="w-24 h-24 bg-linear-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800">
              {user.name[0]}
            </div>
            <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
            <p className="text-slate-400">{user.id}</p>
            
            <div className="w-full mt-8 space-y-3">
              <button className="w-full flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <Settings size={20} className="text-slate-400" /> Account Settings
              </button>
              <button className="w-full flex items-center gap-4 bg-red-900/20 p-4 rounded-2xl border border-red-900/30 text-red-400">
                Logout
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      {/* 3] Top Header */}
      <header className="p-4 flex justify-between items-center border-b border-slate-800 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">A</div>
          <h1 className="text-xl font-bold tracking-tight text-cyan-400">AttendX</h1>
        </div>
        <Bell size={24} className="text-slate-400" />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {renderContent()}
      </main>

      {/* 1] Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 px-6 py-3 rounded-[2.5rem] flex items-center justify-between w-full max-w-sm shadow-2xl">
          <button 
            onClick={() => setActiveTab("home")}
            className={`p-2 rounded-full transition-all ${activeTab === 'home' ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'}`}
          >
            <Home size={28} />
          </button>

          {/* Center QR Button */}
          <button 
            onClick={() => setActiveTab("qr")}
            className="bg-cyan-500 p-4 rounded-full -mt-12 border-4 border-[#020617] shadow-xl shadow-cyan-500/20 text-slate-900 hover:scale-110 transition-transform"
          >
            <QrCode size={32} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-full transition-all ${activeTab === 'profile' ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'}`}
          >
            <User size={28} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Student;