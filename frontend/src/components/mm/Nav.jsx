import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  LogOut,
  MapPin,
  Package,
  RefreshCw,
  Settings,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import Cart from "../Cart";
import { useCart } from "../../context/CartContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
const FINAL_STATUSES = new Set(["delivered", "cancelled"]);

const statusClass = (status) =>
  ({
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-emerald-100 text-emerald-700",
    delivered: "bg-slate-900 text-white",
    cancelled: "bg-rose-100 text-rose-700",
  }[status] || "bg-slate-100 text-slate-700");

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "Not available";

const formatMoney = (value) =>
  `${Number(value || 0).toFixed(2)} MAD`;

function Nav() {
  const { getCartTotal } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  console.log("Nav rendered with user:", storedUser);

  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [client, setClient] = useState(storedUser || null);

  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  // ✅ FIXED: latest order (not only active)
  const latestOrder = orders[0];

  const activeOrdersCount = orders.filter(
    (order) => !FINAL_STATUSES.has(order.status)
  ).length;

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setClient(storedUser || null);
  }, [userId]);

  // ✅ FIXED: load any order
  const loadProfileData = async (silent = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      const [reservationResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_BASE}/reservations/user/${userId}`),
        axios.get(`${API_BASE}/orders/user/${userId}`),
      ]);

      const nextReservations =
        reservationResponse.data.data ||
        reservationResponse.data ||
        [];

      const nextOrders = Array.isArray(ordersResponse.data)
        ? ordersResponse.data
        : [];

      setReservations(nextReservations);
      setOrders(nextOrders);

      if (selectedOrderId) {
        const selectedSummary = nextOrders.find(
          (order) => order.id === selectedOrderId
        );

        if (selectedSummary) {
          setSelectedOrder((current) => ({
            ...(current || {}),
            ...selectedSummary,
          }));

          if (
            selectedSummary.status !== selectedOrder?.status ||
            selectedSummary.updated_at !== selectedOrder?.updated_at
          ) {
            loadTrackedOrder(selectedOrderId, true);
          }
        } else {
          setSelectedOrderId(null);
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error("Profile load failed:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadTrackedOrder = async (orderId, silent = false) => {
    if (!orderId) return;

    if (!silent) {
      setTrackingLoading(true);
      setTrackingError("");
    }

    try {
      const response = await axios.get(
        `${API_BASE}/orders/${orderId}/tracking`
      );

      setSelectedOrder(response.data);

      setOrders((current) =>
        current.map((order) =>
          order.id === response.data.id ? response.data : order
        )
      );
    } catch (error) {
      console.error("Tracking load failed:", error);
      if (!silent)
        setTrackingError("Unable to load this order right now.");
    } finally {
      if (!silent) setTrackingLoading(false);
    }
  };

  const openOrderTracking = (order) => {
    setSelectedOrderId(order.id);
    setSelectedOrder(order);
    loadTrackedOrder(order.id);
  };

  useEffect(() => {
    if (!showProfile) return;

    loadProfileData();

    const intervalId = window.setInterval(
      () => loadProfileData(true),
      30000
    );

    return () => window.clearInterval(intervalId);
  }, [userId, showProfile]);

  // ✅ FIXED: removed FINAL_STATUSES blocking
  useEffect(() => {
    if (!showProfile || !selectedOrderId || !selectedOrder)
      return;

    const intervalId = window.setInterval(() => {
      loadTrackedOrder(selectedOrderId, true);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [showProfile, selectedOrderId]);

  const closeProfile = () => {
    setShowProfile(false);
    setEditing(false);
    setSelectedOrderId(null);
    setSelectedOrder(null);
    setTrackingError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setClient(null);
    closeProfile();
    navigate("/login");
  };

  const cancelReservation = async (reservationId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette reservation ?"))
      return;

    try {
      await axios.patch(
        `${API_BASE}/reservations/${reservationId}/cancel`
      );

      setReservations((current) =>
        current.map((reservation) =>
          reservation.reservation_id === reservationId ||
          reservation.id === reservationId
            ? { ...reservation, status: "Cancelled" }
            : reservation
        )
      );
    } catch (error) {
      alert("Erreur lors de l'annulation.");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette commande ?"))
      return;

    try {
      await axios.put(`${API_BASE}/orders/${orderId}/cancel`);
      await loadProfileData(true);

      if (selectedOrderId === orderId)
        await loadTrackedOrder(orderId, true);
    } catch (error) {
      alert("Impossible d'annuler la commande.");
    }
  };

  const saveProfileChanges = async () => {
    try {
      const response = await axios.put(
        `${API_BASE}/users/${userId}`,
        {
          name: editedName,
          address: editedAddress,
        }
      );

      setClient(response.data.user);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setEditing(false);
    } catch (error) {
      alert("Update failed.");
    }
  };

 

  return (
    <div className="relative w-full font-sans">
      <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tighter hover:scale-105 transition-transform">EAT.</Link>
            <div className="hidden md:flex items-center gap-8">
              {["/", "/Resto", "/Cafe"].map((path) => (
                <Link key={path} to={path} className={`text-sm font-bold transition-all ${isActive(path) ? "text-emerald-600" : "text-slate-500 hover:text-emerald-500"}`}>
                  {path === "/" ? "Home" : path.substring(1)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {client && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <MapPin size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{client.address || "No address yet"}</span>
              </div>
            )}

            <button onClick={() => setShowCart(!showCart)} className="group flex items-center gap-3 bg-slate-900 text-white pl-4 pr-1.5 py-1.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <div className="flex flex-col items-start leading-none pr-2 border-r border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase font-black">Total</span>
                <span className="text-sm font-bold">{getCartTotal().toFixed(2)} $</span>
              </div>
              <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center"><ShoppingBag size={16} /></div>
            </button>

            {client ? (
              <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold uppercase">{client?.name?.charAt(0) || "U"}</div>
                <span className="text-xs font-bold text-slate-700 hidden sm:block">{client.username}</span>
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="text-sm font-black text-slate-900 px-4">Login</button>
            )}
          </div>
        </div>

        {showCart && (
          <div className="absolute top-[80px] right-6 z-[110] w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <span className="font-bold text-slate-800">Your Basket</span>
              <X size={18} className="cursor-pointer text-slate-400" onClick={() => setShowCart(false)} />
            </div>
            <div className="max-h-[400px] overflow-y-auto"><Cart /></div>
          </div>
        )}
      </nav>

      {showProfile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeProfile} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-12 duration-500">
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200"><User size={48} /></div>
              {editing ? (
                <div className="space-y-3 w-full">
                  <input className="w-full p-3 text-sm border-0 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={editedName} onChange={(event) => setEditedName(event.target.value)} placeholder="Name" />
                  <input className="w-full p-3 text-sm border-0 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={editedAddress} onChange={(event) => setEditedAddress(event.target.value)} placeholder="Address" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveProfileChanges} className="flex-1 bg-emerald-600 text-white text-xs py-3 rounded-xl font-bold hover:bg-emerald-700">Save</button>
                    <button onClick={() => setEditing(false)} className="flex-1 bg-white text-slate-500 text-xs py-3 rounded-xl font-bold border border-slate-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900">{client?.username}</h2>
                  <p className="text-sm text-slate-400 mb-3">{client?.email}</p>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">
                    {activeOrdersCount > 0 ? `${activeOrdersCount} active order${activeOrdersCount > 1 ? "s" : ""}` : "No active orders"}
                  </p>
                  <div className="w-full space-y-2">
                   {latestOrder && (
  <button
    onClick={() => openOrderTracking(latestOrder)}
    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700"
  >
    <Truck size={14} /> Track Latest Order
  </button>
)}
                    <button onClick={() => { setEditedName(client?.name || ""); setEditedAddress(client?.address || ""); setEditing(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100">
                      <Settings size={14} /> Edit Profile
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 text-xs font-bold hover:bg-rose-50 rounded-2xl">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 p-10 overflow-y-auto bg-white">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h3>
                <button onClick={closeProfile} className="p-3 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
              ) : (
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20} /></div>
                      <h4 className="text-lg font-bold text-slate-800">Your Reservations</h4>
                    </div>
                    {reservations.length > 0 ? (
                      <div className="grid gap-4">
                        {reservations.map((reservation) => (
                          <div key={reservation.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                            <div>
                              <p className="font-black text-slate-800">{reservation.restaurant_name}</p>
                              <p className="text-xs text-slate-500 font-medium">{reservation.reservation_date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${reservation.status === "confirmed" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}>{reservation.status}</span>
                              {reservation.status !== "Cancelled" && reservation.status !== "cancelled" && (
                                <button onClick={() => cancelReservation(reservation.reservation_id || reservation.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg" title="Annuler la reservation">
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No upcoming bookings</div>
                    )}
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Package size={20} /></div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-800">Recent Orders</h4>
                          <p className="text-xs font-medium text-slate-500">Open any order to see live tracking.</p>
                        </div>
                      </div>
                      <button onClick={() => loadProfileData()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-200">
                        <RefreshCw size={14} /> Refresh
                      </button>
                    </div>

                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-sm">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Order</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Placed</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Total</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-700">{order.order_number}</p>
                                    <p className="text-xs text-slate-400 max-w-[220px] truncate">{order.items_summary}</p>
                                  </td>
                                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{formatDateTime(order.placed_at)}</td>
                                  <td className="px-6 py-4 text-xs font-black text-slate-700">{formatMoney(order.total)}</td>
                                  <td className="px-6 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClass(order.status)}`}>{order.status_label}</span></td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3">
                                      <button onClick={() => openOrderTracking(order)} className={`text-[10px] font-black uppercase tracking-widest ${selectedOrder?.id === order.id ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600"}`}>
                                        {selectedOrder?.id === order.id ? "Tracking" : "Track"}
                                      </button>
                                      {order.can_cancel && <button onClick={() => cancelOrder(order.id)} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600">Cancel</button>}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {(trackingLoading || selectedOrder) && (
                          <div className="rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Live tracking</p>
                                <h5 className="text-xl font-black text-slate-900">{selectedOrder ? `Order ${selectedOrder.order_number}` : "Loading order"}</h5>
                                <p className="text-xs font-medium text-slate-500">Active orders refresh automatically every 15 seconds.</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {selectedOrder && (
                                  <button onClick={() => loadTrackedOrder(selectedOrder.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-200">
                                    <RefreshCw size={14} className={trackingLoading ? "animate-spin" : ""} /> Refresh
                                  </button>
                                )}
                                <button onClick={() => { setSelectedOrderId(null); setSelectedOrder(null); setTrackingError(""); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700">
                                  <X size={14} /> Close
                                </button>
                              </div>
                            </div>

                            {trackingLoading && !selectedOrder ? (
                              <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-emerald-500" size={30} /></div>
                            ) : trackingError ? (
                              <div className="p-6"><div className="rounded-[1.5rem] bg-rose-50 border border-rose-100 px-5 py-4 text-sm font-bold text-rose-600">{trackingError}</div></div>
                            ) : selectedOrder ? (
                              <div className="p-6 space-y-6">
                                <div className="rounded-[1.75rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
                                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                    <div className="space-y-3">
                                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${statusClass(selectedOrder.status)}`}>{selectedOrder.status_label}</span>
                                      <div>
                                        <h6 className="text-2xl font-black text-slate-900 tracking-tight">{selectedOrder.status_note}</h6>
                                        <p className="text-sm text-slate-500 mt-2">Delivery address: <span className="font-semibold text-slate-700">{selectedOrder.delivery_address}</span></p>
                                      </div>
                                    </div>
                                    <div className="grid gap-3 min-w-[220px]">
                                      <div className="rounded-[1.25rem] border border-slate-100 bg-white px-4 py-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Placed</p><p className="text-sm font-bold text-slate-700 mt-1">{formatDateTime(selectedOrder.placed_at)}</p></div>
                                      <div className="rounded-[1.25rem] border border-slate-100 bg-white px-4 py-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last update</p><p className="text-sm font-bold text-slate-700 mt-1">{formatDateTime(selectedOrder.updated_at)}</p></div>
                                      <div className="rounded-[1.25rem] border border-slate-100 bg-white px-4 py-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Delivered</p><p className="text-sm font-bold text-slate-700 mt-1">{selectedOrder.delivered_at ? formatDateTime(selectedOrder.delivered_at) : "Not delivered yet"}</p></div>
                                    </div>
                                  </div>
                                  <div className="mt-6">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2"><span>Order progress</span><span>{selectedOrder.progress_percentage}%</span></div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${selectedOrder.status === "cancelled" ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${selectedOrder.progress_percentage}%` }} /></div>
                                  </div>
                                  {selectedOrder.status === "cancelled" && (
                                    <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-rose-100 bg-rose-50 px-4 py-3 text-rose-600">
                                      <XCircle size={18} className="mt-0.5" />
                                      <div><p className="text-sm font-black">This order was cancelled.</p><p className="text-xs font-medium">You can place a new order whenever you are ready.</p></div>
                                    </div>
                                  )}
                                  <div className="grid gap-3 md:grid-cols-4 mt-6">
                                    {selectedOrder.tracking_steps?.map((step) => (
                                      <div key={step.key} className={`rounded-[1.25rem] border p-4 ${selectedOrder.status === "cancelled" ? "border-slate-200 bg-slate-50 text-slate-400" : step.current ? "border-emerald-200 bg-emerald-50 text-emerald-700" : step.completed ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-500"}`}>
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${selectedOrder.status === "cancelled" ? "bg-white text-slate-300" : step.current ? "bg-emerald-600 text-white" : step.completed ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{step.completed || step.current ? <CheckCircle2 size={16} /> : <Package size={16} />}</div>
                                        <p className="text-sm font-black">{step.label}</p>
                                        <p className="text-xs mt-2 leading-relaxed opacity-80">{step.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid gap-4 lg:grid-cols-3">
                                  <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Store size={18} /></div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Restaurant</p></div><p className="text-sm font-black text-slate-900">{selectedOrder.restaurant?.name || "Unknown restaurant"}</p><p className="text-xs text-slate-500 mt-2">{selectedOrder.restaurant?.address || "Address not available"}</p></div>
                                  <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Truck size={18} /></div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Delivery</p></div><p className="text-sm font-black text-slate-900">{selectedOrder.rider?.name || "Waiting for rider assignment"}</p><p className="text-xs text-slate-500 mt-2">Contact: {selectedOrder.rider?.phone || selectedOrder.contact_number}</p><p className="text-xs text-slate-500 mt-1">{selectedOrder.special_instructions || "No delivery instructions."}</p></div>
                                  <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={18} /></div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payment</p></div><p className="text-sm font-black text-slate-900">{selectedOrder.payment_method_label}</p><p className="text-xs text-slate-500 mt-2 capitalize">Payment status: {selectedOrder.payment_status}</p><p className="text-xs text-slate-500 mt-1">Total: {formatMoney(selectedOrder.total)}</p></div>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-100 overflow-hidden">
                                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                    <div><h6 className="text-lg font-black text-slate-900">Items</h6><p className="text-xs text-slate-500">Everything currently attached to this order.</p></div>
                                    <div className="text-right"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</p><p className="text-lg font-black text-emerald-600">{formatMoney(selectedOrder.total)}</p></div>
                                  </div>
                                  <div className="p-6 space-y-4">
                                    {selectedOrder.items?.map((item) => (
                                      <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-[1.5rem] border border-slate-100 bg-white">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                          {item.image ? <img src={`http://localhost:8000/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" /> : <Package size={18} className="text-slate-300" />}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-black text-slate-900">{item.name}</p>
                                          <p className="text-xs text-slate-500 mt-1">Quantity: {item.quantity} | Unit price: {formatMoney(item.unit_price)}</p>
                                          <p className="text-xs text-slate-500 mt-1">{item.special_instructions || "No special instructions"}</p>
                                        </div>
                                        <div className="text-right"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Line total</p><p className="text-sm font-black text-slate-900">{formatMoney(item.line_total)}</p></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No orders yet</div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
