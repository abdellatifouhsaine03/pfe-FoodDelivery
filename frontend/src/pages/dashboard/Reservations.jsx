"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/dashboard/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, Calendar, Clock, Map, Phone, CheckCircle2, Timer, XCircle } from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [seatingPositions, setSeatingPositions] = useState([]);
  const [seatingAreas, setSeatingAreas] = useState([]);
  const [resto, setResto] = useState(null);

  const id = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/${id}/restaurant`)
      .then((res) => setResto(res.data))
      .catch((err) => console.error("Erreur récupération restaurant", err));
  }, [id]);

  useEffect(() => {
    if (resto) fetchAllData();
  }, [resto]);

  const fetchAllData = async () => {
    try {
      const [resRes, resTables, resZones] = await Promise.all([
        axios.get(`http://localhost:8000/api/restaurants/${resto.restaurant_id}/reservations`),
        axios.get("http://localhost:8000/api/seating-positions"),
        axios.get("http://localhost:8000/api/seating-areas")
      ]);
      setReservations(resRes.data);
      setSeatingPositions(resTables.data);
      setSeatingAreas(resZones.data);
    } catch (error) {
      console.error("Erreur chargement données", error);
    }
  };

  const getTableLabel = (tableId) => {
    const table = seatingPositions.find((t) => t.id === tableId);
    if (!table) return "N/A";
    const zone = seatingAreas.find((z) => z.id === table.seating_area_id);
    return `${zone?.name || "Zone"} • ${table.label}`;
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    canceled: reservations.filter((r) => r.status === "cancelled").length,
  };

  if (!resto) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Header />

      {/* 1. STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Bookings" value={stats.total} icon={Users} color="bg-slate-900" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard label="Pending" value={stats.pending} icon={Timer} color="bg-orange-500" />
        <StatCard label="Canceled" value={stats.canceled} icon={XCircle} color="bg-rose-500" />
      </div>

      {/* 2. ACTIONS HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Today's Schedule</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time occupancy control</p>
        </div>
        <Link to="/Dashboardpartner/zones" className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-sm">
          <Map size={16} /> Manage Zones
        </Link>
      </div>

      {/* 3. RESERVATIONS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Guest</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Timing</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Party Size</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Table Placement</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm">{res.user?.name || "Private Guest"}</span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {res.user?.phone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <Calendar size={12} className="text-orange-500" /> {res.reservation_date}
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {res.reservation_time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
                        {res.number_of_guests}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">People</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-xs text-slate-600 italic">
                    {getTableLabel(res.seating_position_id)}
                  </td>
                  <td className="px-6 py-5 text-right sm:text-left">
                    <StatusBadge status={res.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inherit ${color}`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
    </div>
  </div>
);

// Reusable Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default Reservations;