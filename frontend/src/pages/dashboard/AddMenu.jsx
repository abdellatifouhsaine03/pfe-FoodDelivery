"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, Save, ArrowLeft, Image as ImageIcon, Utensils } from "lucide-react";

export default function AddMenuForm() {
  const [formData, setFormData] = useState({
    name: "", price: "", category: "", description: "", discount: "", image: "", type: "",
  });
  const [restoID, setrestoID] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEditId = localStorage.getItem("editMenuId");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (userId) {
      axios.get(`http://localhost:8000/api/user/${userId}/restaurant`)
        .then((res) => setrestoID(res.data.restaurant_id))
        .catch((err) => console.error("Error fetching restaurant:", err));
    }

    if (storedEditId) {
      axios.get(`http://localhost:8000/api/menus/${storedEditId}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            name: data.name || "",
            price: data.price || "",
            category: data.category || "",
            description: data.description || "",
            discount: data.discount !== null ? data.discount.toString() : "",
            image: data.image || "",
            type: data.type || "",
          });
          setImagePreview(data.image);
          setIsEditing(true);
          setEditId(storedEditId);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "discount" && formData[key] === "") return;
      if (key === "image" && !(formData[key] instanceof File) && isEditing) return;
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("restaurant_id", Number(restoID));

    try {
      const url = isEditing ? `http://localhost:8000/api/menus/${editId}?_method=PUT` : `http://localhost:8000/api/menus`;
      await axios.post(url, formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
      localStorage.removeItem("editMenuId");
      alert(isEditing ? "Dish Updated!" : "Dish Added!");
      navigate("/Dashboardpartner/menu/menulist");
    } catch (error) {
      alert("Error saving dish.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-orange-500 font-bold text-sm transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to List
        </button>
        <h2 className="text-2xl font-black text-slate-900">{isEditing ? "Edit Masterpiece" : "Add New Dish"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COL: TEXT INFO */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Dish Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 outline-none" placeholder="e.g. Truffle Burger" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-slate-700 outline-none resize-none" placeholder="Describe the ingredients and taste..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (MAD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Discount (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 outline-none">
                <option value="">Choose</option>
                <option value="Entrée">Entrée</option>
                <option value="Plat">Plat principal</option>
                <option value="Dessert">Dessert</option>
                <option value="Boisson">Boisson</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 outline-none">
                <option value="">Choose</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Tacos">Tacos</option>
                <option value="Viande">Viande</option>
                <option value="Végétarien">Végétarien</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT COL: IMAGE UPLOAD */}
        <div className="flex flex-col">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 text-center">Dish Photography</label>
          <div className="relative flex-1 group">
            <input type="file" name="image" accept="image/*" onChange={handleChange} required={!isEditing} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center bg-slate-50 group-hover:bg-orange-50 group-hover:border-orange-200 transition-all overflow-hidden relative">
              {imagePreview ? (
                <img src={isEditing && !(formData.image instanceof File) ? `http://localhost:8000/storage/${imagePreview}` : imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="text-center p-6">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300 group-hover:text-orange-500 transition-colors">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Drag & drop your photo</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">JPG, PNG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className={`mt-6 w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-100 ${isEditing ? 'bg-slate-900 text-white hover:bg-orange-600' : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'}`}>
            {isEditing ? <Save size={18} /> : <Plus size={18} />}
            {isEditing ? "Update Menu Item" : "Publish to Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}