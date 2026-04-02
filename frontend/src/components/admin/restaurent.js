"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Search, Eye, XCircle, MapPin, Phone, Mail, Store, AlertCircle } from "lucide-react"

const RestaurantApplications = () => {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8000/api/restaurants/approved")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error("Error fetching restaurants:", err))
  }, [])

  const handleView = (restaurant) => {
    alert(`Viewing:\nName: ${restaurant.name}\nEmail: ${restaurant.user.email}`)
  }

  const handleReject = (restaurantId) => {
    if (window.confirm("Are you sure you want to reject this restaurant?")) {
      axios.put(`http://localhost:8000/api/restaurants/${restaurantId}/reject`)
        .then(() => {
          setRestaurants(prev => prev.filter(r => r.id !== restaurantId))
        })
        .catch(err => console.error("Error rejecting restaurant:", err))
    }
  }

  const filteredRestaurants = restaurants.filter(r =>
    r.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Approved Partners</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Restaurant Directory</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
               <AlertCircle size={40} strokeWidth={1.5} />
            </div>
            <p className="font-bold text-lg text-slate-600">No matching partners found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Restaurant / Owner</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Contact Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Location</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Joined Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRestaurants.map((r) => (
                  <tr key={r.id} className="group hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <Store size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm tracking-tight">{r.name || "Unnamed Store"}</span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">{r.user.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                          <Mail size={12} className="text-emerald-500/60" /> {r.user.email}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                          <Phone size={12} className="text-emerald-500/60" /> {r.user.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <MapPin size={14} className="text-slate-300 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-600 font-medium leading-relaxed">{r.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-slate-400 uppercase">
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(r)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all active:scale-95"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                          VIEW
                        </button>
                        <button 
                          onClick={() => handleReject(r.id)}
                          className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          <XCircle size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantApplications