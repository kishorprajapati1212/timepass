export default function Header({ user }) {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex justify-between items-center">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity cursor-default">
          Attend<span className="text-cyan-400">X</span>
        </h1>
        <div className="h-4 w-px bg-white/20 mx-2 hidden sm:block" />
        <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
          Faculty Portal
        </span>
      </div>

      {/* User Profile Pill */}
      <div
       className="group flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 p-1 pr-4 rounded-full transition-all duration-300 cursor-pointer shadow-inner">
        <div className="relative">
          <div className="w-9 h-9 bg-linear-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-cyan-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {/* Online Status Dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#020617] rounded-full"></span>
        </div>
        
        <div className="flex-col leading-tight hidden sm:flex">
          <span className="text-[11px] font-medium text-slate-200">
            {user?.name || "Faculty"}
          </span>
          <span className="text-[9px] text-cyan-400/80 font-semibold uppercase tracking-wider">
            Verified Admin
          </span>
        </div>
      </div>
    </header>
  );
}