import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Menu from "./Menu";
import MapSection from "../components/MapSection";
import Reviews from "../components/Reviews";

import image1 from "../10.jpeg"

const Resto = () => {
  const [resto, setResto] = useState();
  const { id } = useParams();
  const [contact, setContact] = useState();
  const [similarRestaurants, setSimilarRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8000/api/restaurants/${id}/menus`)
      .then(response => {
        setResto(response.data.restaurant_name);
        setMenu(response.data.categories);
        setContact(response.data.user);
      })
      .catch(err => console.error('Error fetching menu:', err));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/restaurants/${id}/similar`)
      .then(res => setSimilarRestaurants(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!resto) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden bg-slate-900 text-white rounded-2xl">
        <div className="absolute inset-0 opacity-80 rounded-xl ">
          <img src={image1} alt="Hero" className="h-full w-full object-cover rounded-xl" />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-6">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight lg:text-6xl">{resto}</h1>
          <p className="mb-8 text-xl text-gray-300">Fast Delivery • 10-20 Minutes</p>
          <div className="flex flex-wrap gap-4">
            <Link to={`/menu/${id}`} className="rounded-full bg-orange-500 px-8 py-3 font-semibold transition hover:bg-orange-600">
              Order Now
            </Link>
            <Link to="/reservation" className="rounded-full border-2 border-white px-8 py-3 font-semibold backdrop-blur-sm transition hover:bg-white hover:text-slate-900">
              Make a Reservation
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Menu Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Explore Menu</h2>
          <Menu menus={menu} />
        </section>

        {/* Info Grid */}
{/* --- INFO BENTO GRID --- */}
<div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
  
  {/* 1. DELIVERY HOURS - Large & Minimal */}
  <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
    <div>
      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h3 className="text-2xl font-black italic tracking-tighter mb-6 uppercase">Service<br/>Hours</h3>
    </div>
    
    <div className="space-y-3">
      {['Mon — Fri', 'Sat — Sun'].map((period, idx) => (
        <div key={idx} className="flex flex-col border-l-2 border-orange-500 pl-4 py-1">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{period}</span>
          <span className="text-sm font-bold text-gray-900">{idx === 0 ? '09:00 AM - 10:00 PM' : '10:00 AM - 11:00 PM'}</span>
        </div>
      ))}
    </div>
  </div>

  {/* 2. CONTACT HUB - High Contrast / Dark Mode */}
  <div className="lg:col-span-3 bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
    {/* Decorative Background Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] group-hover:bg-orange-500/40 transition-colors" />
    
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-10 relative z-10">Direct Line</h3>
    
    <div className="space-y-8 relative z-10">
      <div className="cursor-pointer group/item">
        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Office Phone</p>
        <p className="text-lg font-bold group-hover/item:text-orange-400 transition-colors">{contact?.user?.phone || "+212 5XX-XXXXXX"}</p>
      </div>
      
      <div className="cursor-pointer group/item">
        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Enquiries</p>
        <p className="text-sm font-bold truncate group-hover/item:text-orange-400 transition-colors">{contact?.user?.email || "hello@restaurant.com"}</p>
      </div>
    </div>

    <button className="mt-12 w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
      Call Support
    </button>
  </div>

  {/* 3. LOCATION / MAP - Modern Inset */}
  <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 group">
    <div className="h-full w-full rounded-[2rem] overflow-hidden relative">
      <MapSection />
      {/* Overlay Badge for Map */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border border-white/50">
        <div>
          <p className="text-[10px] font-black uppercase text-gray-400">Our HQ</p>
          <p className="text-xs font-bold text-gray-900">Casablanca, Morocco</p>
        </div>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs">
          📍
        </div>
      </div>
    </div>
  </div>

</div>

        <Reviews />

        {/* Similar Restaurants */}
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Similar Restaurants</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {similarRestaurants?.map((restaurant) => (
              <div key={restaurant.id} className="group cursor-pointer rounded-xl bg-white p-4 text-center shadow-sm transition hover:shadow-md">
                <div className="mb-3 flex h-16 items-center justify-center overflow-hidden grayscale transition group-hover:grayscale-0">
                  <img src={`http://localhost:8000/storage/${restaurant.logo}`} alt={restaurant.name} className="max-h-full object-contain" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">{restaurant.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resto;