import React, { useEffect, useState } from "react";
import axios from "axios";
import { Circle, Radio  } from "lucide-react";

const STATUS_ORDER = ["available", "on_delivery", "on_break", "offline"];
const STATUS_CONFIG = {
  available: { label: "Disponible", color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  on_delivery: { label: "En livraison", color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
  on_break: { label: "En pause", color: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
  offline: { label: "Offline", color: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50" },
};

export default function RiderStatus({ riderId }) {
  const [status, setStatus] = useState("available");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/rider/status?rider_id=${riderId}`)
      .then((res) => setStatus(res.data.status))
      .catch((err) => console.error("Error fetching status:", err));
  }, [riderId]);

  const updateStatus = (newStatus) => {
    if (loading || status === newStatus) return;
    setLoading(true);
    axios.post(`http://localhost:8000/api/rider/status?rider_id=${riderId}`, { status: newStatus })
      .then((res) => {
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Availability</h3>
        <div className={`px-4 py-1.5 rounded-full ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].text} text-[10px] font-black uppercase`}>
          Currently {status.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-3">
        {STATUS_ORDER.map((key) => {
          const isActive = status === key;
          const config = STATUS_CONFIG[key];
          return (
            <button
              key={key}
              disabled={loading}
              onClick={() => updateStatus(key)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                isActive 
                  ? `border-blue-600 bg-blue-50/50` 
                  : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${config.color} ${isActive ? 'animate-pulse' : 'opacity-40'}`} />
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : ''}`}>
                  {config.label}
                </span>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isActive ? "border-blue-600 bg-blue-600" : "border-slate-200"
              }`}>
                {isActive && <div className="h-2 w-2 bg-white rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}