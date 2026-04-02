import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bike, Store, ClipboardList, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "" },
    { icon: Bike, label: "Riders", path: "riders" },
    { icon: Store, label: "Restaurants", path: "restaurants" },
    { icon: ClipboardList, label: "Partner Requests", path: "requests", badge: "12" },
  ];

  const isActive = (path) => {
    const fullPath = `/adminpage/${path}`.replace(/\/$/, "");
    const current = location.pathname.replace(/\/$/, "");
    return current === fullPath || (path === "" && current === "/adminpage");
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300 border-r border-white/5">
      {/* Brand Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-black text-emerald-950 shadow-lg shadow-emerald-500/20">
            GB
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white">GOBITE</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={`/adminpage/${item.path}`}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                active 
                ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10" 
                : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={active ? "text-emerald-950" : "text-slate-500 group-hover:text-emerald-400"} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              
              {item.badge && !active && (
                <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {item.badge}
                </span>
              )}
              
              {active && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 p-6">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          System Active
        </div>
      </div>
    </div>
  );
};

export default Sidebar;