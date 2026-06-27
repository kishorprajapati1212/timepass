import { motion } from "framer-motion";
import { UserPlus, QrCode, ScanLine, FileSpreadsheet } from "lucide-react";
const steps = [
  {icon:UserPlus,title:"Register Users",desc:"Admins create accounts for students, faculty, and other admins with proper role assignments."},
  {icon:QrCode,title:"Start Session",desc:"Faculty starts a lecture session which generates a unique dynamic QR code for attendance."},
  {icon:ScanLine,title:"Scan & Mark",desc:"Students scan the QR code using their device to instantly mark their attendance."},
  {icon:FileSpreadsheet,title:"Generate Reports",desc:"View real-time attendance data and export detailed reports to Excel format."}
];
const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It <span className="text-gradient">Works</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Four simple steps to revolutionize your attendance management.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s,i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.15 }} className="relative">
            <div className="glass-card p-6 text-center relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <s.icon size={28} className="text-cyan-400" />
              </div>
              <div className="text-xs font-bold text-cyan-400 mb-2">Step {i+1}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length-1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" />}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorksSection;
