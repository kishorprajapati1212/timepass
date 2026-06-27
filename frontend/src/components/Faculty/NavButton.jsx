import React from "react";

export default function NavButton({ active, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ease-out active:scale-90 active:opacity-80
        ${
          active
            ? "bg-cyan-400 text-[#020617] shadow-[0_0_20px_rgba(34,211,238,0.3)] -translate-y-0.5"
            : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
        }`}
    >
      {/* Icon Styling */}
      <div className={`transition-transform duration-300 ${active ? "scale-110" : "scale-100"}`}>
        {React.cloneElement(icon, { 
          size: 20, 
          strokeWidth: active ? 2.5 : 2 
        })}
      </div>

      {/* Subtle Active Indicator Bar */}
      {active && (
        <span className="absolute -bottom-1 w-5 h-1 bg-cyan-400 rounded-full blur-[2px] opacity-50" />
      )}

      {/* Screen reader only label for accessibility */}
      <span className="sr-only">Navigation Link</span>
    </button>
  );
}