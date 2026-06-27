import {
  ShieldCheck,
  Zap,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";


const HowItWorksSection = () => {
  return (
    <section id="how" className="relative z-10 px-8 sm:px-16 py-32">
          <div className="max-w-6xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 italic">The 3-Step Security</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Zap className="text-yellow-400" />,
                img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                title: "1. Initiate Session",
                desc: "Faculty launches a session. The system captures the timestamp and classroom ID."
              },
              {
                icon: <Smartphone className="text-cyan-400" />,
                img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
                title: "2. Dynamic QR",
                desc: "A unique QR code is generated and rotates every 15 seconds to prevent photo sharing."
              },
              {
                icon: <ShieldCheck className="text-green-400" />,
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
                title: "3. Instant Sync",
                desc: "Attendance logs directly into the faculty dashboard with geo-fencing validation."
              }
            ].map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="group relative bg-slate-800/40 border border-white/5 rounded-4xl p-4 hover:border-cyan-500/50 transition-all duration-500"
              >
                <div className="relative h-64 mb-6 overflow-hidden rounded-3xl">
                   <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-linear-to-t from-[#020617] to-transparent opacity-60"></div>
                   <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl">
                     {step.icon}
                   </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-bold text-xl mb-3 text-white">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
  )
}

export default HowItWorksSection