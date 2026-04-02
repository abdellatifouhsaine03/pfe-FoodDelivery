"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. FETCH LOGIC
  useEffect(() => {
    axios.get(`http://localhost:8000/api/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Fetch Error:", err));
  }, [id]);

  // 2. POST LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating < 1) return setMessage("Select a rating first.");
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return setMessage("Please login to review.");
    
    const user = JSON.parse(storedUser);
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/reviews", {
        restaurant_id: id,
        user_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      
      // Update UI immediately
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 0, comment: "" });
      setMessage("Review posted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error submitting. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. SLIDER LOGIC
  const nextReview = () => setCurrentIndex((prev) => (prev + 2 >= reviews.length ? 0 : prev + 2));
  const prevReview = () => setCurrentIndex((prev) => (prev === 0 ? Math.max(reviews.length - 2, 0) : prev - 2));
  const visibleReviews = reviews.slice(currentIndex, currentIndex + 2);

const renderStars = (rating, interactive = false) => {
  const currentRating = interactive ? hoverRating || newReview.rating : rating;
  return [1, 2, 3, 4, 5].map((s) => (
    <span
      key={s}
      className={`transition-all duration-200 ${interactive ? "cursor-pointer text-2xl" : "text-[10px]"} ${
        currentRating >= s ? "text-orange-500 scale-110" : "text-gray-200"
      }`}
      onClick={interactive ? () => setNewReview({ ...newReview, rating: s }) : undefined}
      onMouseEnter={interactive ? () => setHoverRating(s) : undefined}
      onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
    >
      ★
    </span>
  ));
};

  return (
    <section className="mt-12 border-t border-gray-100 pt-10 pb-10">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* LEFT: FORM & STATS (Compact) */}
        <div className="lg:w-1/3 w-full flex flex-col gap-4">
          <div className="bg-black p-6 rounded-[2rem] text-white flex justify-between items-center shadow-xl relative overflow-hidden shrink-0">
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Vibes<span className="text-orange-500">.</span></h2>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{reviews.length} total</p>
            </div>
            <div className="text-4xl font-black italic tracking-tighter text-orange-500">4.1</div>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/10 blur-2xl" />
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-1">
            <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-gray-400">Rate</span>
                <div className="flex gap-1">{renderStars(0, true)}</div>
              </div>
              <textarea
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 h-24 resize-none placeholder:text-gray-300"
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Post Review"}
              </button>
              {message && <p className="text-[9px] font-bold text-center uppercase tracking-widest text-orange-600 animate-pulse">{message}</p>}
            </form>
          </div>
        </div>

        {/* RIGHT: GRID FEED (Horizontal) */}
        <div className="lg:w-2/3 w-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic">Recent</h3>
            <div className="flex gap-2">
               <button onClick={prevReview} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all text-[10px]">←</button>
               <button onClick={nextReview} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all text-[10px]">→</button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {visibleReviews.map((review) => (
              <div key={review.id} className="group bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col justify-between h-[210px] hover:border-gray-200 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-100">
                        {review.user?.name?.substring(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-gray-900 uppercase tracking-tighter text-sm truncate">{review.user?.name}</h4>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">{new Date(review.created_at).toLocaleDateString("fr-FR", { month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-black italic text-sm">{review.rating}.0</span>
                  </div>
                  <p className="text-gray-500 text-xs italic leading-relaxed line-clamp-3">"{review.comment}"</p>
                </div>
                <div className="flex gap-0.5 mt-4 pt-4 border-t border-gray-50">
                   {renderStars(review.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Reviews;