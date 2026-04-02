"use client";
import React from "react";
import Header from "../../components/dashboard/Header";
import Card from "../../components/dashboard/Card";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Image Imports
import x88 from "./81/88.jpg";
import x85 from "./81/85.jpg";
import x87 from "./81/87.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} /> Live Overview
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            Welcome back, <span className="text-orange-500 font-black not-italic">Chef!</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md">
            Everything is looking great today. Here is what's happening with your restaurant.
          </p>
        </div>
      </div>

      {/* THE GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card
          title="Orders"
          image={x88}
          description="Track incoming delivery requests and kitchen status in real-time."
          buttonText="Monitor Orders"
          onClick={() => navigate("/Dashboardpartner/orders")}
        />
        
        <Card
          title="Reservations"
          image={x85}
          description="View upcoming table bookings and manage your floor plan."
          buttonText="Manage Tables"
          onClick={() => navigate("/Dashboardpartner/reservations")}
        />
        
        <Card
          title="Analytics"
          image={x87}
          description="Deep dive into your revenue, top dishes, and customer feedback."
          buttonText="Review Stats"
          onClick={() => navigate("/Dashboardpartner/analytics")}
        />
        
        <Card
          title="Menu"
          image={null} // Example without image to show fallback
          description="Update your dishes, prices, and daily specials."
          buttonText="Edit Menu"
          onClick={() => navigate("/Dashboardpartner/menu/menulist")}
        />
      </div>
    </div>
  );
}