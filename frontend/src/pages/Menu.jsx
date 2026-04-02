import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import Cart from "../components/Cart";

const Menu = ({ menus }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(menus?.[0]?.name);
  const [sortBy, setSortBy] = useState("default");

  const categories = menus?.map((cat) => ({ id: cat.id, name: cat.name }));
  const currentItems = activeCategory
    ? menus?.find((cat) => cat.name === activeCategory)?.items || []
    : menus?.flatMap(cat => cat.items) || [];

  const sortedItems = [...currentItems].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy.includes("name")) return sortBy === "name-asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center gap-2 px-2 pb-2 border-b">
            <span className="text-xl">🍴</span>
            <h3 className="font-bold">Categories</h3>
          </div>
          <ul className="space-y-1">
            {categories?.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition ${
                    activeCategory === cat.name 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{activeCategory || "All Items"}</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Sort By</label>
            <select 
              className="rounded-lg border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-orange-500"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">A to Z</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {sortedItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="sticky top-24">
          <Cart />
        </div>
      </aside>
    </div>
  );
};

export default Menu;