import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, CheckCircle, Package } from 'lucide-react';

export default function RiderTodaySummary({ riderId }) {
  const [earnings, setEarnings] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!riderId) return;
    axios.get(`http://localhost:8000/api/rider/${riderId}/today-summary`)
      .then((res) => {
        setEarnings(res.data.earnings);
        setOrders(res.data.orders);
      })
      .catch((err) => console.error("Error loading summary:", err));
  }, [riderId]);

  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
      <div className="flex items-center gap-2 text-blue-400 mb-2">
        <TrendingUp size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Today's Performance</span>
      </div>
      
      <h2 className="text-4xl font-black tracking-tighter mb-8">
        {earnings.toFixed(2)} <span className="text-lg text-slate-500 font-bold uppercase">DH</span>
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Package size={16} /> Delivered Today
          </h3>
          <span className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">
            {orders.length}
          </span>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar-dark pr-2">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-300">Order #{order.id}</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 italic">
                  {new Date(order.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs font-bold text-slate-500 text-center py-4 italic">No deliveries recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}