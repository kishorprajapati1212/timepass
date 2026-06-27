import React from "react";

export default function QuickAction({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-4xl bg-slate-900/40 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 active:scale-95 overflow-hidden"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon Container */}
      <div className="relative z-10 p-3 rounded-2xl bg-white/5 text-slate-300 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 group-hover:scale-110 transition-all duration-300 shadow-inner">
        {React.cloneElement(icon, { 
          size: 24,
          strokeWidth: 2
        })}
      </div>

      {/* Label */}
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-50 group-hover:tracking-widest transition-all duration-300">
        {label}
      </span>
      
      {/* Bottom Shine Effect */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-cyan-500 opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" />
    </button>
  );
}