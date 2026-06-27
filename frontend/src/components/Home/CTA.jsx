import { Link } from "react-router-dom"
import {
  ArrowRight,
} from "lucide-react";

const CTA = () => {
  return (
    <section className="relative z-10 px-8 py-32 text-center overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-cyan-600/10 blur-[120px] rounded-full -z-10" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Ready to Upgrade your <br />
            <span className="italic">Classroom?</span>
          </h2>

          <Link
            to="/login"
            className="inline-flex items-center gap-4 px-14 py-7 rounded-full bg-cyan-500 text-black font-black text-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)]"
          >
            Launch AttendX
            <ArrowRight strokeWidth={3} />
          </Link>
        </section>
  )
}

export default CTA