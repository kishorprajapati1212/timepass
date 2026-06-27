import React from "react";

export default function StatCard({ icon, label, value, trend }) {
  return (
    <div className="group relative bg-slate-900/40 p-6 rounded-4xl border border-white/5 flex items-center gap-5 transition-all duration-300 hover:bg-slate-800/40 hover:border-white/10 hover:shadow-2xl hover:shadow-cyan-500/5">
      
      {/* Icon Container with "Inner Glow" */}
      <div className="relative p-4 rounded-2xl bg-[#020617] border border-white/10 shadow-inner group-hover:border-cyan-500/30 transition-colors duration-300">
        <div className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
          {React.cloneElement(icon, { size: 24 })}
        </div>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 rounded-tr-md group-hover:border-cyan-500/50" />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-hover:text-slate-400 transition-colors">
          {label}
        </p>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight group-hover:text-cyan-50 transition-colors">
            {value}
          </span>
          
          {/* Optional Trend Indicator - adds that "Real Pro" feel */}
          {trend && (
            <span className={`text-[10px] font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>

      {/* Hover Background Shine */}
      <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/5 via-transparent to-transparent rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}