"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/dashboard/Header";
import { ShoppingCart, Package, Truck, CheckCircle, User, MapPin } from "lucide-react";

export default function TodayOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/orders/today`, {
        params: { user_id: userId },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Fetch error:", error));
  }, [userId]);

  const filteredOrders = activeFilter === "all" 
    ? orders 
    : orders.filter((order) => order.status === activeFilter);

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const FilterButton = ({ id, label, count, icon: Icon }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
        activeFilter === id 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105" 
        : "bg-white text-slate-400 hover:bg-orange-50 hover:text-orange-500 border border-slate-100"
      }`}
    >
      <Icon size={16} />
      {label}
      <span className={`ml-2 px-2 py-0.5 rounded-lg text-[10px] ${activeFilter === id ? "bg-white text-orange-500" : "bg-slate-100 text-slate-500"}`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Header />

      {/* 1. STATUS FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        <FilterButton id="all" label="All Orders" count={stats.all} icon={ShoppingCart} />
        <FilterButton id="pending" label="Pending" count={stats.pending} icon={Package} />
        <FilterButton id="out_for_delivery" label="On Route" count={stats.out_for_delivery} icon={Truck} />
        <FilterButton id="delivered" label="Completed" count={stats.delivered} icon={CheckCircle} />
      </div>

      {/* 2. ORDERS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <ShoppingCart size={48} className="mb-4 opacity-20" />
            <p className="font-bold tracking-tight">No orders found for this category</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 overflow-hidden group">
              
              {/* Card Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 font-black">
                    #{order.order_number.toString().slice(-3)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight">Order #{order.order_number}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <User size={10} /> {order.user?.name || "Guest Customer"}
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${
                  order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {order.status.replace(/_/g, " ")}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group/item">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.menu?.image ? (
                        <img 
                          src={`http://localhost:8000/storage/${item.menu.image}`} 
                          className="h-full w-full object-cover group-hover/item:scale-110 transition-transform" 
                          alt="" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300"><Package size={16}/></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm leading-none">{item.menu?.name}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-700 text-sm">
                        {(item.menu_item?.price ?? item.price ?? 0) * item.quantity} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Footer */}
              <div className="p-6 bg-orange-50/30 border-t border-orange-100/50 flex items-end justify-between">
                <div className="space-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  <div className="flex justify-between w-32"><span>Subtotal:</span> <span>{order.subtotal} MAD</span></div>
                  <div className="flex justify-between w-32"><span>Delivery:</span> <span>{order.delivery_fee} MAD</span></div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{order.total} <span className="text-xs">MAD</span></p>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="px-6 pb-6">
                <button className="w-full py-3 bg-black border-2 border-slate-100 rounded-2xl text-white text-xs font-white uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95">
                  Update Order Status
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}