"use client";
import React, { useEffect, useState } from "react";
import RiderStatus from "./RiderStatus";
import RiderTodaySummary from "./RiderTodaySummary";
import axios from "axios";
import { 
  MapPin, 
  Store, 
  User, 
  Phone, 
  CreditCard, 
  Wallet, 
  ShoppingBag,
  Clock,
  Package
} from "lucide-react";

export function DashboardView() {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const riderId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/orders/rider/order?rider_id=${riderId}`)
      .then((res) => {
        setOrder(res.data);
        setOrderItems(res.data.items);
      })
      .catch((err) => console.error("Error fetching order:", err));
  }, [riderId]);

  return (
    <div className="space-y-10 pb-20">
      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            Welcome back, <span className="text-blue-600">Livreur</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Let's get those deliveries moving
          </p>
        </div>
      </div>

      {/* TOP SECTION: STATUS & SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RiderStatus riderId={riderId} />
        <RiderTodaySummary riderId={riderId} />
      </div>

      {/* ACTIVE ORDER DETAILS */}
      {order ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* Order Info Card */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <Package size={20} /> Active Delivery
                </h2>
                <span className="px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase">
                  In Progress
                </span>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <DetailItem icon={Store} label="Restaurant" value={order.restaurant?.name} />
                <DetailItem icon={MapPin} label="Pickup Address" value={order.restaurant?.address} color="text-blue-600" />
                <DetailItem icon={User} label="Customer" value={order.user?.name} />
                <DetailItem icon={MapPin} label="Delivery Address" value={order.delivery_address} color="text-rose-500" />
                <DetailItem icon={Phone} label="Contact" value={order.contact_number} />
                <DetailItem icon={CreditCard} label="Payment" value={`${order.payment_status} - ${order.payment_method}`} />
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Earnings</p>
                      <p className="text-sm font-black text-slate-900">{order.delivery_fee} DH <span className="text-blue-600">(Net: 3.50 DH)</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-600" /> Items List
              </h2>
              <div className="space-y-4">
                {orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                    <img 
                      src={`http://localhost:8000/storage/${item.menu?.image}`} 
                      className="h-14 w-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                      alt={item.menu?.name} 
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{item.menu?.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">
                        {item.special_instructions || `Quantity: ${item.quantity}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <Clock size={48} className="mb-4 opacity-20" />
          <p className="font-black uppercase tracking-widest text-xs">Waiting for new orders...</p>
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ icon: Icon, label, value, color = "text-slate-900" }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon size={14} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-xs font-bold leading-relaxed ${color}`}>{value}</p>
  </div>
);