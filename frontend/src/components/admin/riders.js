"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { 
  Search, Eye, XCircle, MapPin, Phone, 
  Mail, Bike, AlertCircle, X, Filter, Calendar 
} from "lucide-react"

const RiderApplications = () => {
  const [riders, setRiders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("all") // Bonus: extra filter

  useEffect(() => {
    axios.get("http://localhost:8000/api/riders/approved")
      .then(res => setRiders(res.data))
      .catch(err => console.error("Error fetching riders:", err))
  }, [])

  const handleView = (rider) => {
    alert(`Viewing rider: ${rider.user.name}`)
  }

  const handleReject = (riderId) => {
    if (window.confirm("Are you sure you want to reject this rider?")) {
      axios.put(`http://localhost:8000/api/riders/${riderId}/reject`)
        .then(() => {
          setRiders(prev => prev.filter(r => r.id !== riderId))
        })
        .catch(err => console.error("Error rejecting rider:", err))
    }
  }

  const filteredRiders = riders.filter(rider =>
    rider.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. SEARCH & FILTER SECTION */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Riders</h2>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Fleet Management</p>
          </div>

          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                <Filter size={12} />
                {filteredRiders.length} Active Riders
              </div>
           </div>
           
           {searchTerm && (
             <button 
               onClick={() => setSearchTerm("")}
               className="text-[10px] font-black text-rose-500 hover:text-rose-600 flex items-center gap-1 uppercase tracking-wider"
             >
               <X size={14} strokeWidth={3} /> Clear Search
             </button>
           )}
        </div>
      </div>

      {/* 2. TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        {filteredRiders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300">
            <div className="p-6 bg-slate-50 rounded-full mb-4">
               <AlertCircle size={48} strokeWidth={1} />
            </div>
            <p className="font-black text-slate-500 text-lg uppercase tracking-tighter">No riders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Rider Profile</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Contact Info</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Location</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRiders.map((rider) => (
                  <tr key={rider.id} className="group hover:bg-emerald-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white transition-all duration-500 border border-slate-200 group-hover:border-emerald-400 shadow-sm">
                          <Bike size={22} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm tracking-tight">{rider.user.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Calendar size={10} /> Joined {new Date(rider.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Mail size={12} className="text-emerald-500/60" />
                          {rider.user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Phone size={12} className="text-emerald-500/60" />
                          {rider.user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <MapPin size={14} className="text-slate-300 mt-0.5 shrink-0" />
                        <span className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2">{rider.address || "No address provided"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleView(rider)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md"
                        >
                          VIEW
                        </button>
                        <button 
                          onClick={() => handleReject(rider.id)}
                          className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                          title="Remove Rider"
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

export default RiderApplications