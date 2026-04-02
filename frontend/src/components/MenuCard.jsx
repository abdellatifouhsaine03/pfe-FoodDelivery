import React from "react";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
  const { id, name, description, image, price } = item;
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold shadow-sm backdrop-blur-md">
          {price} DH
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-900 leading-tight">{name}</h3>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>
        
        <button 
          onClick={() => addToCart({ id, name, image, price })}
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 active:scale-95"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MenuCard;