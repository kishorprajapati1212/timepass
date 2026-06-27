import {
  Zap,
  Lock,
  Globe,
  BarChart3,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 px-8 sm:px-16 py-20 bg-slate-900/50 border-y border-white/5">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold mb-4">Why Top Universities Trust Us</h2>
                 <p className="text-slate-400">Hardware-level security meets consumer-grade UX.</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                 {[
                    { icon: <Lock className="text-cyan-400"/>, title: "Geo-Fencing", desc: "Students must be inside the classroom radius." },
                    { icon: <Globe className="text-blue-400"/>, title: "Offline Sync", desc: "Works even when campus WiFi goes down." },
                    { icon: <BarChart3 className="text-purple-400"/>, title: "Analytics", desc: "Export attendance reports in one click." },
                    { icon: <Zap className="text-yellow-400"/>, title: "Fast Scan", desc: "Process 50 students in under 1 minute." }
                 ].map((item, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                       <div className="mb-4">{item.icon}</div>
                       <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                       <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>
  )
}

export default FeaturesSection