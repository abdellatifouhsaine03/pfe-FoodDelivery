"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2, Filter, ChevronRight, Tag } from "lucide-react";

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous");
  const [selectedDiscount, setSelectedDiscount] = useState("Tous");

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`http://localhost:8000/api/users/${user?.id}/menus`);
      setMenuItems(response.data);
    } catch (error) { console.error("Error loading menus:", error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      try {
        await axios.delete(`http://localhost:8000/api/menus/${id}`);
        fetchMenus();
      } catch (error) { console.error("Error deleting:", error); }
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem("editMenuId", id);
    window.location.href = "/Dashboardpartner/menu/add";
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
    const matchesType = selectedType === "Tous" || item.type === selectedType;
    const matchesDiscount = selectedDiscount === "Tous" || (item.discount && item.discount >= parseInt(selectedDiscount));
    return matchesCategory && matchesType && matchesDiscount;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category || "Autres";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</label>
      <select value={value} onChange={onChange} className="bg-white border-transparent ring-1 ring-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all">
        {options.map((opt, i) => <option key={i} value={opt}>{opt === "Tous" ? "All" : opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 text-orange-500 mr-4">
          <Filter size={20} strokeWidth={2.5} />
          <span className="font-black text-sm uppercase tracking-tighter text-slate-800">Filter Menu</span>
        </div>
        <FilterSelect label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} options={["Tous", ...new Set(menuItems.map(i => i.category))]} />
        <FilterSelect label="Dish Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} options={["Tous", ...new Set(menuItems.map(i => i.type))]} />
        <FilterSelect label="Min Discount" value={selectedDiscount} onChange={(e) => setSelectedDiscount(e.target.value)} options={["Tous", "10", "20", "30", "50"]} />
      </div>

      {/* MENU GROUPS */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <section key={category} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight italic">{category}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-100 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden relative">
                
                {/* Image Area */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-50">
                  {item.image && (
                    <img src={`http://localhost:8000/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1 uppercase tracking-widest">
                      <Tag size={10} strokeWidth={3} /> {item.discount}% OFF
                    </div>
                  )}
                  
                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(item.id)} className="p-3 bg-white text-slate-900 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-800 tracking-tight text-lg truncate group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <span className="font-black text-orange-500 text-sm whitespace-nowrap">{item.price} MAD</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    {item.type || "Specialty"} <ChevronRight size={10} />
                  </p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 h-8 pt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}