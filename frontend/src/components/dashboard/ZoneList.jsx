import React from "react";
import ZoneCard from "./ZoneCard";
import { MapIcon } from "lucide-react";

export default function ZoneList({ zones, onEdit, onDelete }) {
  if (zones.length === 0) {
    return (
      <div className="py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <MapIcon size={48} className="mb-4 opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">No zones defined yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {zones.map((zone) => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}