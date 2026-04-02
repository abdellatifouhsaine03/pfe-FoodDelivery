import { Bell, LogOut, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // Dynamic title based on current path
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("riders")) return "Rider Applications";
    if (path.includes("restaurants")) return "Restaurant Partners";
    return "Partnership Requests";
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shrink-0 shadow-sm z-10">
      
      {/* Left Section: Contextual Title */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
            {getTitle()}
          </h1>
          <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 md:block">
            Management Dashboard
          </p>
        </div>
      </div>

      {/* Right Section: Search, Notifications, Profile */}
      <div className="flex items-center gap-6">
        
        {/* Simple Search Mockup (Optional but looks professional) */}
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="group relative flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors">
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
          </div>
          <span className="hidden text-sm font-bold md:inline">Alerts</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* Admin User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-black text-slate-900 leading-tight">Admin User</span>
            <span className="text-[11px] font-bold text-slate-400">admin@gobite.ma</span>
          </div>
          
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-black text-white shadow-md">
              A
            </div>
            {/* Online Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></div>
          </div>

          {/* Logout Button */}
          <button className="ml-2 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;