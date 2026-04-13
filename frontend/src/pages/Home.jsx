
import Nav from "../components/mm/Nav"
import Hero from "../components/mm/Hero"
import RestaurantCafe from "../components/mm/RestaurantCafe"
import Map from "../components/mm/Map"
import Partners from "../components/mm/Partners"
import "./Home.css"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function Home() {
  const location = useLocation();
    const navigate = useNavigate();

useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check if we have verification data in the URL
    if (params.get("verified") === "true") {
      const userData = {
        username: params.get("username"),
        email: params.get("email"),
        address: params.get("address"),
        type: params.get("type") || "client",
         // Critical for ProtectedRoute
      };

      // Save to localStorage under the key "user" (matching your ProtectedRoute)
      localStorage.setItem("user", JSON.stringify(userData));

      // Clean the URL so the user doesn't see the parameters anymore
      navigate("/", { replace: true });
      window.location.reload(); 
      
      // Optional: Refresh or notify user
      console.log("Profile verified and saved!");
    }
  }, [location, navigate]);

  return (
    <div className="app-container">
      <main>
        <Hero />
        <RestaurantCafe />
        <Partners />
      </main>
    </div>
  )
}

export default Home
