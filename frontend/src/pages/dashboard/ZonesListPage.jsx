"use client";
import React, { useEffect, useState } from "react";
import ZoneList from "../../components/dashboard/ZoneList";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import axios from "axios";
import { ArrowLeft, Plus, Map as MapIcon } from "lucide-react";

export default function ZonesListPage() {
  const [zones, setZones] = useState([]);
  const [resto, setresto] = useState();
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/${id}/restaurant`).then(res => {
      setresto(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (resto?.restaurant_id) {
      fetchZones();
    }
  }, [resto]);

  const fetchZones = async () => {
    try {
      const res = await api.get(`/seating-areas?restaurant_id=${resto.restaurant_id}`);
      setZones(res.data);
    } catch (error) {
      console.error("Error fetching seating areas:", error);
    }
  };

  const handleDelete = async (zoneId) => {
    if (window.confirm("Delete this zone and all its tables?")) {
      try {
        await api.delete(`/seating-areas/${zoneId}`);
        setZones((prev) => prev.filter((z) => z.id !== zoneId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (zone) => {
    localStorage.setItem("editZone", JSON.stringify(zone));
    navigate("/Dashboardpartner/zones/edit");
  };

  const handleAdd = () => {
    localStorage.removeItem("editZone");
    navigate("/Dashboardpartner/zones/add");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            className="group flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-black text-[10px] uppercase tracking-[0.2em] mb-2" 
            onClick={() => navigate("/Dashboardpartner/reservations")}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Reservations
          </button>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <MapIcon className="text-orange-500" size={28} />
            Floor Plan <span className="text-slate-300 font-light">& Zones</span>
          </h2>
        </div>

        <button 
          className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 active:scale-95" 
          onClick={handleAdd}
        >
          <Plus size={18} strokeWidth={3} />
          Create New Zone
        </button>
      </div>

      {/* ZONE GRID */}
      <ZoneList zones={zones} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}