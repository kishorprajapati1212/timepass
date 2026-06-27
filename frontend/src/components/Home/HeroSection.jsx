import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  PlayCircle,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative z-10 px-8 sm:px-16 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Next-Gen Smart Attendance
              </div>

              <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] tracking-tight text-white">
                Attendance <br />
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Without Proxies.
                </span>
              </h1>

              <p className="text-slate-400 max-w-lg text-lg sm:text-xl leading-relaxed">
                Eliminate "buddy-punching" using <span className="text-white border-b border-cyan-500/50">Dynamic Refresh QR</span> technology. Secure, time-sensitive, and classroom-verified.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link
                  to="/login"
                  className="px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-cyan-500 text-black font-black text-lg hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all"
                >
                  Enter System
                </Link>
                <button className="flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl border border-slate-700 font-bold hover:bg-white/5 transition-all text-white">
                  <PlayCircle className="text-cyan-400" />
                  Watch Flow
                </button>
              </div>
            </motion.div>

            {/* RIGHT VISUAL - MOCKUP */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-slate-900 border border-white/10 rounded-4xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                  alt="Students in classroom"
                  className="opacity-40 h-100 sm:h-125 w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-md bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-3xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-bold">CS101: Data Structs</h3>
                        <p className="text-slate-400 text-sm">Dr. Sarah Jenkins</p>
                      </div>
                      <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-md animate-pulse">LIVE</div>
                    </div>
                    
                    <div className="aspect-square bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-4 relative overflow-hidden group/qr">
                        <div className="absolute inset-0 bg-cyan-400/10 group-hover/qr:bg-transparent transition-colors"></div>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AttendX-${Date.now()}`} 
                          alt="QR" 
                          className="w-40 h-40 mix-blend-multiply" 
                        />
                        <span className="text-black font-mono font-bold text-xs tracking-widest uppercase">
                          Refreshes in <span className="text-red-500">04s</span>
                        </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 right-6 sm:right-10 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl text-black transform rotate-3 hover:rotate-0 transition-transform hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified Scan Rate</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">98.2%</span>
                    <ShieldCheck className="text-green-500 mb-1" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
  )
}

export default HeroSection