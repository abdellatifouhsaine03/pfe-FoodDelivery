import React from "react";
import { Edit3, Trash2, Users, Armchair, CheckCircle2, XCircle } from "lucide-react";

export default function ZoneCard({ zone, onEdit, onDelete }) {
  const positions = Array.isArray(zone.seating_positions) ? zone.seating_positions : [];
  const totalTables = positions.length;
  const available = positions.filter((t) => Number(t.is_available) === 1).length;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden flex flex-col group">
      
      {/* IMAGE & OVERLAY */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`http://localhost:8000/storage/${zone.image_url}`}
          alt={zone.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <h3 className="text-xl font-black text-white tracking-tight">{zone.name}</h3>
          <div className="flex gap-2">
             <button 
              onClick={() => onEdit(zone)}
              className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-orange-500 transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onDelete(zone.id)}
              className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="flex divide-x divide-slate-50 border-b border-slate-50 bg-slate-50/30">
        <div className="flex-1 px-6 py-4 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tables</span>
          <span className="text-lg font-black text-slate-900">{totalTables}</span>
        </div>
        <div className="flex-1 px-6 py-4 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
          <span className="text-lg font-black text-emerald-500">{available}</span>
        </div>
      </div>

      {/* TABLES DETAILS SCROLL AREA */}
      <div className="p-6 space-y-3 flex-grow max-h-60 overflow-y-auto custom-scrollbar">
        {positions.length > 0 ? (
          positions.map((table) => (
            <div key={table.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group/item hover:bg-white hover:ring-1 hover:ring-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${Number(table.is_available) === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  <Armchair size={14} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">Table {table.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Users size={10} /> {table.capacity} Seats
                  </p>
                </div>
              </div>
              {Number(table.is_available) === 1 ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <XCircle size={14} className="text-slate-300" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-xs font-bold text-slate-300 italic">No tables assigned</div>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-slate-50 px-6">
         <button 
           onClick={() => onEdit(zone)}
           className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
         >
           Configure Layout
         </button>
      </div>
    </div>
  );
}