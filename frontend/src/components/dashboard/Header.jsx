"use client";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Bell, 
  Search, 
  Command, 
  ChevronDown, 
  Settings, 
  Clock,
  LayoutGrid
} from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect for that "sticky glass" feel
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes("/orders")) return { title: "Order Monitor", subtitle: "Real-time kitchen flow" };
    if (path.includes("/reservations")) return { title: "Table Bookings", subtitle: "Floor management" };
    if (path.includes("/analytics")) return { title: "Insights", subtitle: "Growth & Performance" };
    if (path.includes("/menu")) return { title: "Menu Editor", subtitle: "Dish availability & pricing" };
    return { title: "Executive Overview", subtitle: "Welcome back, Chef" };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 px-8 py-4 ${
      isScrolled 
      ? "bg-white/80 backdrop-blur-md border-b border-orange-100/50 shadow-sm" 
      : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        
        {/* LEFT: DYNAMIC PAGE TITLE */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex h-12 w-12 bg-orange-500 rounded-2xl items-center justify-center text-white shadow-lg shadow-orange-200">
             <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                {subtitle}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 italic">
                <Clock size={10} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: SEARCH BAR (COMMAND STYLE) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-10 relative group">
          <Search className="absolute left-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything... (Cmd + K)"
            className="w-full bg-slate-100/50 border-transparent rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
          />
          <div className="absolute right-3 px-1.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-400 shadow-sm flex items-center gap-0.5">
            <Command size={10} /> K
          </div>
        </div>

        {/* RIGHT: UTILITIES & PROFILE */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Notifications */}
          <button className="relative p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all group">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 border-2 border-white rounded-full group-hover:scale-125 transition-transform" />
          </button>

          {/* Settings */}
          <button className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all hidden sm:block">
            <Settings size={20} strokeWidth={2.5} />
          </button>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

          {/* User Profile Dropdown */}
          <button className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
            <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:border-orange-500 transition-colors">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef" 
                alt="Avatar" 
                className="bg-orange-100"
              />
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-xs font-black text-slate-800 tracking-tight">Main Kitchen</span>
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter">Verified Partner</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
          </button>
        </div>

      </div>
    </header>
  );
}