"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import Header from '../../components/dashboard/Header';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/analytics')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données analytiques", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      
      <main className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* PAGE TITLE & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              Performance <span className="text-indigo-600">Analytics</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Suivi hebdomadaire de votre activité
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
              <Calendar size={14} /> 7 Derniers Jours
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <Download size={14} /> Exporter
            </button>
          </div>
        </div>

        {/* ANALYTICS CARD */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* CARD HEADER */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Vue d'ensemble</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commandes vs Réservations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden sm:flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Commandes</span>
               </div>
               <div className="hidden sm:flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Réservations</span>
               </div>
            </div>
          </div>

          {/* CHART CONTAINER */}
          <div className="p-8 pt-4">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <filter id="shadow" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="2" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.1" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="semaine" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }} 
                      labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="commandes" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Commandes (MAD)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="reservations" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Réservations" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY STATS BELOW CHART */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStat label="Total Revenu" value="45,280 MAD" trend="+12%" />
          <QuickStat label="Réservations" value="128" trend="+5%" />
          <QuickStat label="Taux de conversion" value="14.2%" trend="-2%" color="text-rose-500" />
        </div>
      </main>
    </div>
  );
}

function QuickStat({ label, value, trend, color = "text-emerald-500" }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        <span className={`text-[10px] font-bold ${color}`}>{trend}</span>
      </div>
    </div>
  );
}