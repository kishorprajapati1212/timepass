import {
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 sm:px-16 py-6 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
      <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
        Attend<span className="text-cyan-400">X</span>
      </h1>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
        <a href="#how" className="hover:text-cyan-400 transition-colors">
          How it Works
        </a>
        <a href="#features" className="hover:text-cyan-400 transition-colors">
          Features
        </a>
      </nav>

      <Link
        to="/login"
        className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-cyan-400 transition-all duration-300 active:scale-95"
      >
        Login
        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </header>
  );
};

export default Header;
