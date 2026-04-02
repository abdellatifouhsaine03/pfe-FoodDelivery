"use client";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

// Page Imports
import Home from "./dashboard/Home";
import Orders from "./dashboard/Orders";
import ZonesListPage from "./dashboard/ZonesListPage";
import AddZonePage from "./dashboard/AddZonePage";
import Reservations from "./dashboard/Reservations";
import Analytics from "./dashboard/Analytics";
import Menu from "./dashboard/Menu";
import AddMenuForm from "./dashboard/AddMenu";
import MenuList from "./dashboard/MenuList";

export default function DashboardResto() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
      {/* 1. SIDEBAR CONTAINER */}
      <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 hidden md:block">
        <Sidebar />
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
          
          {/* Dashboard Header Spacer (Optional - if your sidebar doesn't have a logo) */}
          <div className="mb-8 flex items-center justify-between">
             {/* You can put a Global Search or User Profile here later */}
          </div>

          {/* PAGE CONTENT ROUTER */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/zones" element={<ZonesListPage />} />
              <Route path="/zones/add" element={<AddZonePage />} />
              <Route path="/zones/edit" element={<AddZonePage />} />
              
              <Route path="/menu" element={<Menu />}>
                <Route path="add" element={<AddMenuForm />} />
                <Route path="menulist" element={<MenuList />} />
              </Route>
              
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
          
        </div>
      </main>
    </div>
  );
}