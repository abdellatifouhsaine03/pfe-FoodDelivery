import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Globe,
  Command,
  ArrowUpRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-zinc-500 py-10 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        
        {/* MAIN COMPACT ROW */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* 1. BRAND & STATUS */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gradient-to-tr from-amber-500 to-yellow-200 rounded-xl rotate-3 flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Command className="text-black" size={20} />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tighter uppercase italic block leading-none">
                Café<span className="text-amber-500">.</span>Inc
              </span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Protocol v.4.2</span>
            </div>
          </div>

          {/* 2. COMPACT NAVIGATION */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {["Discovery", "Partners", "Contact", "Privacy"].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="group flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all"
              >
                {link}
                <ArrowUpRight size={10} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </nav>

          {/* 3. SOCIALS & ENCRYPTION */}
          <div className="flex flex-col items-center lg:items-end gap-3">
            <div className="flex gap-2">
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Globe} />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">Secure Connection Active</span>
            </div>
          </div>

        </div>

        {/* BOTTOM THIN BAR */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-zinc-700">
          <p>© 2026 ALL RIGHTS RESERVED</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-amber-500 transition-colors">Cookies</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }) => (
  <a href="#" className="h-9 w-9 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300">
    <Icon size={14} />
  </a>
);

export default Footer;