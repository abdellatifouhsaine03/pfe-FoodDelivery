"use client";
import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  UserCircle, 
  Truck, 
  LogOut,
  ChevronRight
} from "lucide-react";

import logo from "./4.png"

// Views
import { DashboardView } from "./Views/DashboardView";
import { TrackOrderView } from "./Views/TrackOrderView";
import { ProfileView } from "./Views/ProfileView";
import EditRiderProfile from "./Views/EditRiderProfile";

export default function AppLivreur() {
  const location = useLocation();
  const navigate = useNavigate();

  // Updated check to match your nested routing structure
  const isActive = (path) => {
    if (path === "/livreur" && location.pathname === "/livreur") return true;
    return location.pathname.startsWith(path) && path !== "/livreur";
  };

  const NavButton = ({ path, icon: Icon, label }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group ${
          active 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
            : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} strokeWidth={active ? 2.5 : 2} />
          <span className="font-black text-xs uppercase tracking-widest">{label}</span>
        </div>
        {active && <ChevronRight size={14} className="animate-pulse" />}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* 1. RIDER SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 h-screen transition-all">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
            <img src={logo} alt="Logo" className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">GO<span className="text-blue-600">Bite</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Livreur Pro</p>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="flex-1 space-y-2">
          <NavButton path="/livreur" icon={LayoutDashboard} label="Dashboard" />
          <NavButton path="/livreur/orders" icon={Package} label="Commandes" />
        </nav>

        {/* BOTTOM PROFILE & LOGOUT */}
        <div className="pt-6 border-t border-slate-50 space-y-2">
          <NavButton path="/livreur/profile" icon={UserCircle} label="Mon Profil" />
          
          <button 
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-black text-xs uppercase tracking-widest mt-4"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="orders" element={<TrackOrderView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="riders/:id/edit" element={<EditRiderProfile />} />
          </Routes>
        </div>
      </main>

    </div>
  );
}