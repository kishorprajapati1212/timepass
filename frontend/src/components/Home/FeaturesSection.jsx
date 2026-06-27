import { motion } from "framer-motion";
import { QrCode, BarChart3, Bell, Shield, Zap, Clock } from "lucide-react";
const features = [
  {icon:QrCode,title:"QR Code Scanning",desc:"Students mark attendance instantly by scanning dynamic QR codes generated during lectures.",color:"cyan"},
  {icon:BarChart3,title:"Real-time Analytics",desc:"Track attendance trends, generate reports, and export data to Excel with one click.",color:"blue"},
  {icon:Bell,title:"Instant Notifications",desc:"Get notified about low attendance, upcoming lectures, and important announcements.",color:"purple"},
  {icon:Shield,title:"Secure & Reliable",desc:"JWT-based authentication with role-based access control ensures data security.",color:"emerald"},
  {icon:Zap,title:"Fast & Efficient",desc:"Optimized backend with caching and compression for lightning-fast performance.",color:"amber"},
  {icon:Clock,title:"Session Management",desc:"Faculty can start and end lecture sessions with automatic attendance tracking.",color:"rose"}
];
const colorMap = { cyan:"border-cyan-500/20 text-cyan-400", blue:"border-blue-500/20 text-blue-400", purple:"border-purple-500/20 text-purple-400", emerald:"border-emerald-500/20 text-emerald-400", amber:"border-amber-500/20 text-amber-400", rose:"border-rose-500/20 text-rose-400" };
const bgMap = { cyan:"from-cyan-500/20 to-cyan-500/5", blue:"from-blue-500/20 to-blue-500/5", purple:"from-purple-500/20 to-purple-500/5", emerald:"from-emerald-500/20 to-emerald-500/5", amber:"from-amber-500/20 to-amber-500/5", rose:"from-rose-500/20 to-rose-500/5" };
const FeaturesSection = () => (
  <section id="features" className="py-20 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful <span className="text-gradient">Features</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage attendance efficiently in one place.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f,i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
            className={`glass-card p-6 border ${colorMap[f.color]} hover:border-opacity-50 transition-all duration-300 group`}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgMap[f.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <f.icon size={24} className={colorMap[f.color].split(" ")[1]} />
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
export default FeaturesSection;
