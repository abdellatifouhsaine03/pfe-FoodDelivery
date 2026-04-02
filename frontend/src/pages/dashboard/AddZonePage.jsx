"use client";
import React, { useEffect, useState } from "react";
import ZoneForm from "../../components/dashboard/ZoneForm";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import axios from "axios";
import { ArrowLeft, Layout } from "lucide-react";

export default function AddZonePage() {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("user")).id;
  const [resto, setresto] = useState();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/${id}/restaurant`).then((res) => {
      setresto(res.data);
    });
  }, [id]);

  const handleSave = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("restaurant_id", resto.restaurant_id);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      formData.append("tables", JSON.stringify(data.tables));

      if (data.id) {
        formData.append("_method", "PUT");
        await api.post(`/seating-areas/${data.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/seating-areas?user_id=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      localStorage.removeItem("editZone");
      navigate("/Dashboardpartner/zones");
    } catch (error) {
      console.error("Save error:", error.response?.data || error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const editZone = localStorage.getItem("editZone");
  const isEditMode = !!editZone;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/Dashboardpartner/zones")}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Zones
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
          <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Layout size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {isEditMode ? "Edit Seating Zone" : "Create New Zone"}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              {isEditMode ? "Updating layout and capacity" : "Define your restaurant layout"}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <ZoneForm
            initialData={isEditMode ? JSON.parse(editZone) : null}
            onSubmit={handleSave}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}