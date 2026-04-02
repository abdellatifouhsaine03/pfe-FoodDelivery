"use client";
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, CalendarCheck, 
  BarChart3, UtensilsCrossed, LogOut 
} from "lucide-react";

import logo from "./1.png"

export default function Sidebar() {
  const navItems = [
    { to: "/Dashboardpartner", label: "Dashboard", icon: LayoutDashboard },
    { to: "/Dashboardpartner/orders", label: "Orders", icon: ShoppingBag },
    { to: "/Dashboardpartner/reservations", label: "Reservations", icon: CalendarCheck },
    { to: "/Dashboardpartner/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/Dashboardpartner/menu/menulist", label: "Menu", icon: UtensilsCrossed },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8">
        <div className="flex items-center gap-3">
          {/* Brand Icon changed to Orange */}
          <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <img src={logo} alt="Logo" className="text-white" size={22} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">
            GO<span className="text-orange-500">Bite</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50" 
                : "text-slate-400 hover:bg-orange-50/50 hover:text-orange-500"}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={`transition-colors ${isActive ? "text-orange-500" : "text-slate-400 group-hover:text-orange-500"}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-sm font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 font-bold text-sm hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}