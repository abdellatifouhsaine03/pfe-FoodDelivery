"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import photo1 from '../20.jpg';

function Cafe_Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [cafe, setcafe] = useState("");
  const [menu, setmenu] = useState([]);
  const [contact, setcontact] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [popularcafe, setpopularcafes] = useState([]);
  
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [sortBy, setSortBy] = useState("default");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8000/api/restaurants/${id}/menus`)
      .then(res => {
        setcafe(res.data.restaurant_name);
        setmenu(res.data.categories);
        setcontact(res.data.user);
      }).catch(err => console.error(err));

    axios.get(`http://localhost:8000/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/cafes/popular")
      .then(res => setpopularcafes(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!cafe) return (
    <div className="flex h-screen items-center justify-center font-bold text-orange-500 animate-pulse">
      Loading restaurant...
    </div>
  );

  // Helpers
  const renderStars = (rating) => (
    <div className="flex gap-0.5 items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
      ))}
    </div>
  );

  const categories = menu?.map(cat => ({ id: cat.id, name: cat.name, image: cat.image }));
  const currentItems = activeCategory 
    ? menu.find(cat => cat.name === activeCategory)?.items || [] 
    : menu.flatMap(cat => cat.items) || [];

  const sortedItems = [...currentItems].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen font-['Poppins'] text-gray-800">
      
      {/* HERO SECTION */}
      <section 
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center text-white px-6"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${photo1})` }}
      >
        <div className="max-w-4xl w-full z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg">{cafe}</h1>
          
          <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2">
            <input type="text" placeholder="Search menu..." className="flex-1 p-3 text-gray-800 border-none outline-none rounded-lg focus:ring-2 focus:ring-orange-200" />
            <select className="p-3 text-gray-600 bg-gray-50 rounded-lg outline-none cursor-pointer">
              <option>All Menu</option>
              <option>Drinks</option>
              <option>Food</option>
            </select>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">Search</button>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-900 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Open until 10 PM
        </div>
      </section>

      {/* RESTAURANT HEADER */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-b border-gray-200 bg-white">
        <h2 className="text-3xl font-bold mb-2">{cafe}</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {renderStars(4.2)}
            <span className="text-gray-900">4.2</span>
          </div>
          <span className="text-gray-400 border-l pl-6 uppercase text-xs tracking-widest font-bold">531 reviews</span>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
        
        {/* LEFT: MENU */}
        <div className="lg:col-span-8">
          
          {/* CATEGORIES BAR */}
          <div className="bg-[#2A1B12] rounded-3xl overflow-hidden mb-12 flex items-stretch shadow-xl">
            <div className="bg-orange-500 p-8 flex items-center justify-center border-r border-white/10 shrink-0">
              <h3 className="text-white font-black uppercase vertical-text tracking-tighter text-xl">Menu</h3>
            </div>
            <div className="flex-1 flex overflow-x-auto p-4 gap-4 scrollbar-hide">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl cursor-pointer transition-all ${
                    activeCategory === cat.name ? "bg-white text-gray-900 scale-105 shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <img src={cat.image || "/placeholder.svg"} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20" />
                  <span className="text-xs font-bold uppercase tracking-tight">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCTS LIST */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-black uppercase italic text-gray-900">{activeCategory || "All Items"}</h3>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 text-sm">
                <label className="text-gray-400 font-bold uppercase text-[10px]">Sort:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="outline-none bg-transparent font-bold">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low</option>
                  <option value="price-desc">Price: High</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedItems?.map((product) => (
                <div key={product.id} className="group flex bg-white p-4 rounded-2xl border border-gray-50 hover:border-orange-100 transition-all shadow-sm hover:shadow-md">
                  <img src={product.image} className="w-32 h-24 rounded-xl object-cover shrink-0" />
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{product.name}</h4>
                      <span className="text-orange-500 font-black text-lg">{product.price} $</span>
                    </div>
                    <p className="text-gray-400 text-sm italic mt-1 line-clamp-2">{product.description}</p>
                    <span className="inline-block mt-3 text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase italic">
                      {activeCategory || "Signature"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: RESERVATION & INFO */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* RESERVATION CARD */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full" /> Reservation
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                <span className="text-xl opacity-40">👥</span>
                <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="bg-transparent outline-none w-full font-bold">
                  <option value="2">2 People</option>
                  <option value="4">4 People</option>
                  <option value="6">6+ People</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-gray-50 p-4 rounded-2xl outline-none text-xs font-bold" />
                <input type="time" className="bg-gray-50 p-4 rounded-2xl outline-none text-xs font-bold" />
              </div>
              <button 
                onClick={() => navigate(`/reservation/${id}`)}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95"
              >
                Find a Table
              </button>
            </div>
          </div>

          {/* OPERATIONAL TIMES */}
          <div className="bg-[#1a1a2e] p-8 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 blur-[100px]" />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
              <span className="text-orange-500">🕒</span> Opening Hours
            </h3>
            <div className="space-y-3">
              {['Monday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-bold uppercase">{day}</span>
                  <span className="font-mono text-orange-400">08:00 - 22:00</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
             <h3 className="text-sm font-black uppercase text-orange-600 mb-6 tracking-widest">Connect</h3>
             <div className="space-y-4">
               <div>
                 <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
                 <p className="font-black text-gray-900 text-lg">{contact?.phone}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                 <p className="font-black text-gray-900 text-sm truncate">{contact?.email}</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SLIDER */}
      <section className="bg-white py-5 ">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Customer <span className="text-orange-500 italic">Vibes.</span></h2>
           <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {reviews.map((r) => (
                <div key={r.id} className="min-w-[350px] bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div className="flex justify-between mb-4">
                      <span className="font-black text-gray-900 uppercase tracking-tighter">{r.user.name}</span>
                      {renderStars(r.rating)}
                   </div>
                   <p className="text-gray-500 text-sm italic leading-relaxed line-clamp-3">"{r.comment}"</p>
                   <p className="mt-6 text-[10px] font-bold text-gray-300 uppercase">{new Date(r.created_at).toDateString()}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SIMILAR RESTAURANTS */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-black uppercase tracking-widest mb-12 flex items-center gap-4">
            <span className="h-px w-20 bg-orange-500" /> Similar Vibes
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {popularcafe?.map((c) => (
              <div key={c.id} className="min-w-[200px] group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                  <img src={`http://localhost:8000/storage/${c.logo}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="font-black uppercase tracking-tighter text-lg">{c.name}</p>
                <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Open Now</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cafe_Menu;