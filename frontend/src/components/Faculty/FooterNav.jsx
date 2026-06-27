  import { LayoutDashboard, QrCode, User } from "lucide-react";
  import NavButton from "./NavButton";

  export default function FooterNav({ activePage, setActivePage }) {
    return (
      <footer className="fixed bottom-8 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-around w-full max-w-[320px] bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-2 rounded-4xl shadow-2xl shadow-black/50 ring-1 ring-white/5">
          
          <NavButton 
            active={activePage === "dashboard"} 
            icon={<LayoutDashboard size={22} />} 
            label="Home"
            onClick={() => setActivePage("dashboard")} 
          />
          
          <NavButton 
            active={activePage === "qr-session"} 
            icon={<QrCode size={22} />} 
            label="Scan"
            onClick={() => setActivePage("qr-session")} 
          />
          
          <NavButton 
            active={activePage === "profile"} 
            icon={<User size={22} />} 
            label="Account"
            onClick={() => setActivePage("profile")} 
          />

        </div>
      </footer>
    );
  }