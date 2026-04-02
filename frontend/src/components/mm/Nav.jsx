import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  LogOut, 
  X, 
  Calendar, 
  Package, 
  Settings, 
  Loader2,
  Trash2 // Added for a clean cancel icon
} from "lucide-react";
import Cart from "../Cart";
import { useCart } from "../../context/CartContext";

function Nav() {
  const { cartItems, getCartTotal } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const id = storedUser?.id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resvRes, orderRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/reservations/user/${id}`),
          axios.get(`http://localhost:8000/api/orders/user/${id}`)
        ]);
        setReservations(resvRes.data.data || resvRes.data);
        setOrders(orderRes.data);
        setClient(storedUser);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setClient(null);
    setShowProfile(false);
    navigate("/login");
  };

  // --- NEW: Cancel Reservation Logic ---
  const cancelReservation = async (reservationId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    try {
      await axios.patch(`http://localhost:8000/api/reservations/${reservationId}/cancel`);
      setReservations(prev => 
        prev.map(r => (r.reservation_id === reservationId || r.id === reservationId) ? { ...r, status: "Cancelled" } : r)
      );
    } catch (err) {
      alert("Erreur lors de l'annulation.");
    }
  };

  // --- NEW: Cancel Order Logic ---
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette commande ?")) return;
    try {
      // Assuming your API supports a DELETE or PATCH to cancel orders
      await axios.delete(`http://localhost:8000/api/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      alert("Impossible d'annuler la commande.");
    }
  };

  const saveProfileChanges = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/users/${id}`, { 
        name: editedName, 
        address: editedAddress 
      });
      const updatedUser = res.data.user;
      setClient(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
    } catch (err) {
      alert("Update failed.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative w-full font-sans">
      <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tighter hover:scale-105 transition-transform">EAT.</Link>
            <div className="hidden md:flex items-center gap-8">
              {['/', '/Resto', '/Cafe'].map((path) => (
                <Link key={path} to={path} className={`text-sm font-bold transition-all ${isActive(path) ? "text-emerald-600" : "text-slate-500 hover:text-emerald-500"}`}>
                  {path === '/' ? 'Home' : path.substring(1)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {client && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <MapPin size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{client.address}</span>
              </div>
            )}

            <button onClick={() => setShowCart(!showCart)} className="group flex items-center gap-3 bg-slate-900 text-white pl-4 pr-1.5 py-1.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <div className="flex flex-col items-start leading-none pr-2 border-r border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase font-black">Total</span>
                <span className="text-sm font-bold">{getCartTotal()} $</span>
              </div>
              <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center"><ShoppingBag size={16} /></div>
            </button>

            {client ? (
              <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold uppercase">{client.name.charAt(0)}</div>
                <span className="text-xs font-bold text-slate-700 hidden sm:block">{client.name}</span>
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowProfile(false)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-12 duration-500">
            
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform"><User size={48} /></div>
              {editing ? (
                <div className="space-y-3 w-full">
                  <input className="w-full p-3 text-sm border-0 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Name" />
                  <input className="w-full p-3 text-sm border-0 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} placeholder="Address" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveProfileChanges} className="flex-1 bg-emerald-600 text-white text-xs py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100">Save</button>
                    <button onClick={() => setEditing(false)} className="flex-1 bg-white text-slate-500 text-xs py-3 rounded-xl font-bold border border-slate-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900">{client?.name}</h2>
                  <p className="text-sm text-slate-400 mb-6">{client?.email}</p>
                  <div className="w-full space-y-2">
                    <button onClick={() => { setEditedName(client?.name); setEditedAddress(client?.address); setEditing(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"><Settings size={14} /> Edit Profile</button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 text-xs font-bold hover:bg-rose-50 rounded-2xl transition-all"><LogOut size={14} /> Sign Out</button>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 p-10 overflow-y-auto bg-white">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h3>
                <button onClick={() => setShowProfile(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400"><X size={24}/></button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
              ) : (
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20}/></div>
                        <h4 className="text-lg font-bold text-slate-800">Your Reservations</h4>
                      </div>
                    </div>
                    {reservations.length > 0 ? (
                      <div className="grid gap-4">
                        {reservations.map((res) => (
                          <div key={res.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 hover:border-blue-100 transition-all group">
                            <div>
                              <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{res.restaurant_name}</p>
                              <p className="text-xs text-slate-500 font-medium">{res.reservation_date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${res.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{res.status}</span>
                              {/* --- CANCEL BUTTON FOR RESERVATION --- */}
                              {res.status !== 'Cancelled' && res.status !== 'cancelled' && (
                                <button 
                                  onClick={() => cancelReservation(res.reservation_id || res.id)} 
                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Annuler la réservation"
                                >
                                  <Trash2 size={18}/>
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

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Package size={20}/></div>
                        <h4 className="text-lg font-bold text-slate-800">Recent Orders</h4>
                      </div>
                    </div>
                    {orders.length > 0 ? (
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-sm">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Order</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Details</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">#{order.id}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{order.items}</td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{order.status}</span>
                                  {/* --- CANCEL BUTTON FOR ORDERS --- */}
                                  {order.status !== 'Completed' && (
                                    <button 
                                      onClick={() => cancelOrder(order.id)} 
                                      className="text-[10px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 hover:underline transition-all"
                                    >
                                      Annuler
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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