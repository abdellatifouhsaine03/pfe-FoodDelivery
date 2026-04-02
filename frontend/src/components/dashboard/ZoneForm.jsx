"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Armchair, Hash, Users } from "lucide-react";

export default function ZoneForm({ initialData, onSubmit, isEditMode }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    name: initialData?.name || "",
    image: null,
    tables: Array.isArray(initialData?.seating_positions) ? initialData.seating_positions : [],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [newTable, setNewTable] = useState({ number: "", capacity: "", status: "available" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        name: initialData.name || "",
        image: null,
        tables: Array.isArray(initialData?.seating_positions)
          ? initialData.seating_positions.map((table) => {
              const numberMatch = table.label?.match(/Table\s*[-_]?(\d+)/i);
              return {
                ...table,
                number: numberMatch ? numberMatch[1] : table.label,
                status: table.is_available ? "available" : "unavailable",
              };
            })
          : [],
      });
      if (initialData.image_url) {
        setImagePreview(`http://localhost:8000/storage/${initialData.image_url}`);
      }
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTable = () => {
    if (!newTable.number || !newTable.capacity) return;
    const updatedTables = [...(formData.tables || []), {
      id: `T${Date.now()}`,
      number: newTable.number,
      capacity: newTable.capacity,
      status: "available",
    }];
    setFormData((prev) => ({ ...prev, tables: updatedTables }));
    setNewTable({ number: "", capacity: "", status: "available" });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-10">
      
      {/* ZONE BASICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Zone Identity</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Terrace, VIP Lounge..."
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500 font-bold transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Zone Map/Photo</label>
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center gap-3 text-slate-400 group-hover:border-orange-300 transition-colors">
              <Upload size={18} />
              <span className="text-xs font-bold truncate">
                {formData.image ? formData.image.name : "Upload image..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {imagePreview && (
        <div className="relative h-48 w-full rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
        </div>
      )}

      <hr className="border-slate-100" />

      {/* TABLE MANAGEMENT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Armchair size={18} className="text-orange-500" /> Table Configuration
          </h3>
        </div>

        {/* Quick Add Row */}
        <div className="p-4 bg-orange-50/50 rounded-3xl border border-orange-100 flex flex-wrap md:flex-nowrap gap-3 items-center">
          <div className="relative flex-1 min-w-[120px]">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              placeholder="Table No."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none text-sm font-bold focus:ring-2 focus:ring-orange-500"
              value={newTable.number}
              onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
            />
          </div>
          <div className="relative flex-1 min-w-[120px]">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="number"
              placeholder="Seats"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none text-sm font-bold focus:ring-2 focus:ring-orange-500"
              value={newTable.capacity}
              onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={handleAddTable}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Add Table
          </button>
        </div>

        {/* Dynamic Table List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.tables.map((table, index) => (
            <div key={table.id || index} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-orange-200 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Unit {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.tables.filter((_, i) => i !== index);
                    setFormData({ ...formData, tables: updated });
                  }}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 w-12">Label:</span>
                  <input
                    className="flex-1 bg-transparent border-b border-slate-100 focus:border-orange-500 outline-none text-sm font-bold"
                    value={table.number}
                    onChange={(e) => {
                      const updated = [...formData.tables];
                      updated[index].number = e.target.value;
                      setFormData({ ...formData, tables: updated });
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 w-12">Seats:</span>
                  <input
                    type="number"
                    className="flex-1 bg-transparent border-b border-slate-100 focus:border-orange-500 outline-none text-sm font-bold"
                    value={table.capacity}
                    onChange={(e) => {
                      const updated = [...formData.tables];
                      updated[index].capacity = e.target.value;
                      setFormData({ ...formData, tables: updated });
                    }}
                  />
                </div>
                <select
                  className="w-full mt-2 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest p-2"
                  value={table.status}
                  onChange={(e) => {
                    const updated = [...formData.tables];
                    updated[index].status = e.target.value;
                    setFormData({ ...formData, tables: updated });
                  }}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Blocked</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
          isEditMode 
          ? "bg-slate-900 text-white shadow-slate-200" 
          : "bg-orange-500 text-white shadow-orange-200"
        }`}
      >
        {isEditMode ? "Confirm Changes" : "Create Zone Infrastructure"}
      </button>
    </form>
  );
}