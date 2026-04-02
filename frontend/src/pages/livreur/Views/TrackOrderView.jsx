"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Package, MapPin, Store, CreditCard, Info, CheckCircle2, Truck, Loader2 } from "lucide-react";

export function TrackOrderView() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const riderId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/orders/delivered/${riderId}`)
      .then((response) => {
        setOrders(response.data);
        const myOrder = response.data.find(
          (order) => order.rider_id === riderId && order.status === "out_for_delivery"
        );
        setCurrentOrder(myOrder ? myOrder.id : null);
      })
      .catch((error) => console.error("Error loading orders:", error))
      .finally(() => setLoading(false));
  };

  const handleAssign = async (orderId) => {
    if (currentOrder) {
      window.alert("❌ Terminez votre livraison en cours d'abord !");
      return;
    }
    try {
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/assign`, { rider_id: riderId });
      setCurrentOrder(orderId);
      fetchOrders();
    } catch (error) {
      alert("❌ Impossible de prendre cette commande.");
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/delivered`);
      setCurrentOrder(null);
      fetchOrders();
    } catch (error) {
      alert("❌ Erreur lors de la validation.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Historique & <span className="text-blue-600">Suivi</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gérez vos livraisons actives et passées</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="N° de commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              riderId={riderId} 
              onAssign={handleAssign} 
              onDeliver={handleMarkAsDelivered} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

const OrderCard = ({ order, riderId, onAssign, onDeliver }) => {
  const isMine = order.rider_id === riderId;
  const isPending = !order.rider_id;
  const isDelivered = order.status === "delivered";

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden flex flex-col ${isMine && !isDelivered ? 'ring-2 ring-blue-600 shadow-xl shadow-blue-100 border-transparent' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDelivered ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'}`}>
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Commande #{order.order_number}</h3>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isDelivered ? 'text-emerald-500' : 'text-blue-500'}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        {isMine && !isDelivered && <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>}
      </div>

      <div className="p-6 space-y-4 flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1"><Store size={10}/> Restaurant</label>
            <p className="text-[11px] font-bold text-slate-700">{order.restaurant?.name || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1"><CreditCard size={10}/> Total</label>
            <p className="text-[11px] font-bold text-slate-900">{order.total} MAD</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1"><MapPin size={10}/> Destination</label>
          <p className="text-[11px] font-bold text-slate-700 leading-tight">{order.delivery_address}</p>
        </div>

        {order.special_instructions && (
          <div className="p-3 bg-slate-50 rounded-xl flex gap-2 items-start">
            <Info size={14} className="text-slate-400 mt-0.5" />
            <p className="text-[10px] font-medium text-slate-500 italic leading-snug">{order.special_instructions}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 mt-auto">
        {isPending && (
          <button onClick={() => onAssign(order.id)} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
            <Truck size={14} /> Prendre la commande
          </button>
        )}

        {isMine && order.status === "out_for_delivery" && (
          <button onClick={() => onDeliver(order.id)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Valider Livraison
          </button>
        )}

        {isMine && isDelivered && (
          <div className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase text-center border border-emerald-100">
            Livraison Terminée
          </div>
        )}
      </div>
    </div>
  );
};