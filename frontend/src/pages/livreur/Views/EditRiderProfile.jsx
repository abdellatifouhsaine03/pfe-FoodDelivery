"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { User, Phone, MapPin, ArrowLeft, Save, Loader2 } from "lucide-react";

const EditRiderProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/riders/${id}`)
      .then(res => {
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement :", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    axios.put(`http://localhost:8000/api/riders/${id}`, formData)
      .then(() => {
        setSuccess('Profil mis à jour avec succès !');
        setTimeout(() => navigate('/livreur/profile'), 1500);
      })
      .catch(err => {
        console.error("Erreur mise à jour :", err);
        setSuccess("Une erreur est survenue.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/livreur/profile')}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Retour au profil
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-2xl font-black tracking-tighter">Paramètres du Compte</h2>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Mettez à jour vos informations personnelles</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success && (
            <div className={`p-4 rounded-2xl text-xs font-bold text-center ${success.includes('succès') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
              {success}
            </div>
          )}

          <div className="space-y-4">
            <InputField 
              icon={User} 
              label="Nom Complet" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              icon={Phone} 
              label="Téléphone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              icon={MapPin} 
              label="Adresse / Zone" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
      <Icon size={12} /> {label}
    </label>
    <input
      {...props}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
    />
  </div>
);

export default EditRiderProfile;