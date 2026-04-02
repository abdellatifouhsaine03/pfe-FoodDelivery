"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Star, 
  Package, 
  Clock, 
  Wallet,
  ShieldCheck
} from "lucide-react";

const STATUS_MAP = {
  available: { label: "Disponible", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
  on_delivery: { label: "En livraison", color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
  on_break: { label: "En pause", color: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
  offline: { label: "Hors ligne", color: "bg-slate-400", light: "bg-slate-100 text-slate-500" },
};

export function ProfileView() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const riderId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(`http://localhost:8000/api/riders/${riderId}/profile`);
        setDriver(response.data);
      } catch (error) {
        console.error("Erreur profile load:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [riderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chargement du profil...</p>
      </div>
    );
  }

  if (!driver) return <div className="text-center p-20 font-bold text-slate-400">Aucun profil trouvé.</div>;

  const currentStatus = STATUS_MAP[driver.status] || STATUS_MAP.offline;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 border-4 border-white">
            {driver.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{driver.name}</h1>
              <ShieldCheck className="text-blue-500" size={24} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${currentStatus.light}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.color}`}></span>
                {currentStatus.label}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{riderId}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/livreur/riders/${riderId}/edit`)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <Edit3 size={16} />
          Modifier Profil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONTACT INFO */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Coordonnées</h3>
            <div className="space-y-6">
              <InfoRow icon={Phone} label="Téléphone" value={driver.phone} />
              <InfoRow icon={Mail} label="Email" value={driver.email} />
              <InfoRow icon={MapPin} label="Zone Active" value={driver?.address || "Casablanca, MA"} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERFORMANCE STATS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Package} label="Livraisons" value={driver.total_deliveries} color="text-blue-600" />
            <StatCard icon={Star} label="Évaluation" value={driver.rating} color="text-amber-500" />
            <StatCard icon={Clock} label="Heures" value={driver.total_hours} color="text-indigo-600" />
          </div>

          {/* DAILY SUMMARY PANEL */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Aujourd'hui</h3>
                <span className="text-[10px] font-bold px-3 py-1 bg-white/10 rounded-lg">Performance Live</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Gains Totaux</p>
                  <p className="text-3xl font-black">{driver.today_earnings} <span className="text-sm font-bold text-slate-500">MAD</span></p>
                </div>
                <div className="space-y-2 border-l border-white/10 sm:pl-8">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Missions</p>
                  <p className="text-3xl font-black">{driver.today_deliveries || 0}</p>
                </div>
                <div className="space-y-2 border-l border-white/10 sm:pl-8">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Temps Actif</p>
                  <p className="text-3xl font-black">{driver.today_hours} <span className="text-sm font-bold text-slate-500">HRS</span></p>
                </div>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Wallet size={200} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Internal Mini-Components for Cleanliness
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-all">
    <div className={`p-3 rounded-2xl bg-slate-50 mb-4 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={24} />
    </div>
    <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</div>
  </div>
);