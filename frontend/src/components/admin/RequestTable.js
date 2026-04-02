"use client";
import React, { useState } from "react";
import axios from "axios";
import { 
  Eye, Check, X, FileText, Smartphone, Mail, 
  MapPin, Utensils, PlusCircle, Loader2 
} from "lucide-react";

const RequestTable = ({ requests, type, onViewDetails, onUpdateStatus }) => {
  const [loadingId, setLoadingId] = useState(null);

  // THE FIX: Unified handler for both Approve and Reject
  const handleAction = async (id, action) => {
    setLoadingId(id);
    try {
      const endpoint = type === "rider" ? "riders" : "restaurants";
      
      // Update Backend
      await axios.put(`http://localhost:8000/api/${endpoint}/${id}/${action}`);
      
      // Update Frontend State (Crucial for the buttons to disappear)
      const finalStatus = action === "approve" ? "approved" : "rejected";
      if (onUpdateStatus) onUpdateStatus(id, finalStatus);
      
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
      alert(`Error: Could not ${action} request. Check backend logs.`);
    } finally {
      setLoadingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || "bg-slate-100 text-slate-600"}`}>
        {status}
      </span>
    );
  };

  const DocChip = ({ href, label, icon: Icon }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded-md hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 hover:border-emerald-200 group/doc"
    >
      <Icon size={12} className="group-hover/doc:text-emerald-500" />
      <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
    </a>
  );

  const Th = ({ children }) => (
    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 bg-slate-50/50">
      {children}
    </th>
  );

  return (
    <div className="overflow-x-auto bg-white rounded-[2rem] border border-slate-200 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th>{type === "rider" ? "Rider" : "Restaurant"}</Th>
            <Th>Contact</Th>
            <Th>Documents</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {requests.map((item) => (
            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
              {/* Identity Column */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-sm">{type === "rider" ? item.user?.name : item.name}</span>
                  {type === "rider" && <span className="text-[10px] font-bold text-emerald-500 uppercase">{item.vehicle_type} • {item.license_plate}</span>}
                  {type === "restaurant" && <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={10}/> {item.address}</span>}
                </div>
              </td>

              {/* Contact Column */}
              <td className="px-6 py-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Mail size={12}/> {item.user?.email}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Smartphone size={12}/> {item.user?.phone}</span>
                </div>
              </td>

              {/* Documents Column */}
              <td className="px-6 py-5">
                <div className="flex gap-2">
                  {type === "rider" ? (
                    <>
                      <DocChip href={`http://localhost:8000/storage/${item.id_document_path}`} label="ID" icon={FileText} />
                      <DocChip href={`http://localhost:8000/storage/${item.driving_license_path}`} label="DL" icon={PlusCircle} />
                    </>
                  ) : (
                    <DocChip href={`http://localhost:8000/storage/${item.business_license}`} label="License" icon={FileText} />
                  )}
                </div>
              </td>

              {/* Status Column */}
              <td className="px-6 py-5">
                <StatusBadge status={item.status} />
              </td>

              {/* Actions Column */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onViewDetails(item)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"><Eye size={16}/></button>
                  
                  {item.status === "pending" && (
                    <>
                      <button
                        disabled={loadingId === item.id}
                        onClick={() => handleAction(item.id, "approve")}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {loadingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                      </button>
                      <button
                        disabled={loadingId === item.id}
                        onClick={() => handleAction(item.id, "reject")}
                        className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;