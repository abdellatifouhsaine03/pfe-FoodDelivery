"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Card({ title, description, buttonText, onClick, image }) {
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
      
      {/* Visual Header: Icon/Image Area */}
      <div className="relative h-40 w-full mb-6 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
             <span className="font-black text-4xl uppercase tracking-tighter opacity-20">{title.charAt(0)}</span>
          </div>
        )}
        
        {/* Floating Action Badge */}
        <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm">
          <ArrowUpRight size={20} strokeWidth={3} />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">
          {title}
        </h2>
        <p className="text-sm font-medium text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Button Section */}
      <div className="mt-6">
        <button 
          onClick={onClick}
          className="w-full py-3 bg-slate-50 text-slate-600 font-black text-[11px] uppercase tracking-[0.15em] rounded-xl group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all active:scale-95"
        >
          {buttonText}
        </button>
      </div>
      
      {/* Subtle Background Accent */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
    </div>
  );
}