"use client";
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Plus, LayoutGrid, Info } from "lucide-react";

export default function Menu() {
  const location = useLocation();
  const isAddPage = location.pathname.includes("/add");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. GLASS HEADER SECTION */}
      <div className="bg-white/60 backdrop-blur-md sticky top-0 z-30 -mx-4 px-4 py-4 sm:-mx-8 sm:px-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Menu <span className="text-orange-500 italic">Studio</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            {isAddPage ? "Drafting New Creation" : "Managing Live Catalog"}
          </p>
        </div>

        {/* 2. MODERN SEGMENTED CONTROL */}
        <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center shadow-inner inline-flex self-start">
          <NavLink 
            to="/Dashboardpartner/menu/menulist" 
            className={({ isActive }) => `
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all
              ${isActive 
                ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200/50" 
                : "text-slate-500 hover:text-slate-700"}
            `}
          >
            <LayoutGrid size={14} strokeWidth={3} />
            Overview
          </NavLink>
          
          <NavLink 
            to="/Dashboardpartner/menu/add" 
            className={({ isActive }) => `
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all
              ${isActive 
                ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200/50" 
                : "text-slate-500 hover:text-slate-700"}
            `}
          >
            <Plus size={14} strokeWidth={3} />
            Add Dish
          </NavLink>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: MAIN CONTENT (Outlet) */}
        <div className="xl:col-span-9">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm overflow-hidden min-h-[70vh]">
            <div className="p-6 md:p-8">
              <Outlet />
            </div>
          </div>
        </div>

        {/* RIGHT: CONTEXTUAL SIDEBAR (Helpful Stats/Tips) */}
        <div className="xl:col-span-3 space-y-6 hidden xl:block">
          <div className="bg-orange-500 rounded-[2rem] p-6 text-white shadow-lg shadow-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Info size={18} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-widest">Chef's Corner</h4>
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-90">
              Dishes with custom photos sell <span className="font-black underline">3x faster</span> than those without. Keep your pricing competitive for the weekend rush!
            </p>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-500">Active Items</span>
                <span className="text-lg font-black tracking-tighter">24</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-500">Discounts Live</span>
                <span className="text-lg font-black tracking-tighter text-orange-500">08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}