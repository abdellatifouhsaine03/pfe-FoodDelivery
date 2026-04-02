import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const RestaurantCafe = () => {
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Restaurants and Cafes
    axios.get("http://localhost:8000/api/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error("Error fetching restaurants:", err));

    // Promotions and Categories
    axios.get('http://localhost:8000/api/best-promotions-and-categories')
      .then(res => {
        setAllPromotions(res.data.menus);
        setCategories(res.data.categories);
        setFilteredPromotions(res.data.menus);
      })
      .catch(err => console.error("Erreur fetch promos:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredPromotions(allPromotions);
    } else {
      setFilteredPromotions(allPromotions.filter(menu => menu.category === selectedCategory));
    }
  }, [selectedCategory, allPromotions]);

  return (
    <div className="my-8 px-4 md:px-0">
      
      {/* Best Promotion Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Best Promotion %</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-full text-sm border transition-all ${!selectedCategory ? 'bg-[#00a651] text-white border-[#00a651]' : 'bg-transparent text-gray-600 border-gray-300 hover:border-[#00a651]'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedCategory === category ? 'bg-[#00a651] text-white border-[#00a651]' : 'bg-transparent text-gray-600 border-gray-300 hover:border-[#00a651]'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Promotion Cards - Horizontal Scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 scroll-smooth no-scrollbar select-none">
          {filteredPromotions.map(promo => (
            <div 
              className="group relative min-w-[300px] flex-none rounded-xl overflow-hidden bg-black transition-all duration-300 hover:shadow-xl" 
              key={promo.id}
            >
              {/* Image Container */}
              <div className="relative h-[180px]">
                <img 
                  src={`http://localhost:8000/storage/${promo.image}`} 
                  alt={promo.name} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#00a651] text-white px-3 py-1 rounded-md font-bold text-sm">
                  -{promo.discount}%
                </span>
              </div>

              {/* Info Overlay / Cart Button logic */}
              <div className="p-4 relative min-h-[100px] flex items-center">
                {/* Standard Info - Hidden on hover */}
                <div className="w-full transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                  <span className="block text-xs text-gray-300 mb-1">{promo.restaurant?.name || "Unknown"}</span>
                  <h3 className="text-lg font-semibold text-white leading-tight">{promo.name}</h3>
                  <div className="absolute right-4 top-4 text-right">
                    <span className="block text-sm text-red-500 line-through">{promo.price} $</span>
                    <span className="text-lg font-bold text-[#00ffcc]">
                      {(promo.price - (promo.price * promo.discount) / 100).toFixed(2)}$
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button - Shown on hover */}
                <button
                  className="absolute inset-x-4 hidden group-hover:block bg-[#00a651] hover:bg-[#008c44] text-white py-3 rounded-lg font-bold transition-colors animate-in fade-in zoom-in duration-200"
                  onClick={() => addToCart({
                    id: promo.id,
                    name: promo.name,
                    image: promo.image,
                    price: Number((promo.price - (promo.price * promo.discount) / 100).toFixed(2)),
                  })}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
          {filteredPromotions.length === 0 && (
            <p className="text-gray-500 italic">No promotions found in this category.</p>
          )}
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Restaurants</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="group flex-none w-[200px] h-[220px] rounded-xl cursor-pointer transition-transform hover:-translate-y-2 overflow-hidden"
              style={{ backgroundColor: restaurant.color || '#FC8A06' }}
              onClick={() => navigate(`/Resto/${restaurant.id}`)}
            >
              <div className="h-4/5 w-full">
                <img
                  src={`http://localhost:8000/storage/${restaurant.logo}`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-b-xl"
                />
              </div>
              <div className="h-1/5 flex items-center justify-center">
                <h3 className="text-sm font-bold text-white group-hover:scale-110 transition-transform">
                    {restaurant.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RestaurantCafe;