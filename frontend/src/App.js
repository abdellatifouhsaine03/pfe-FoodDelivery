import { Routes, Route, useLocation } from "react-router-dom";
import Cafe from "./pages/Cafe";
import Nav from "./components/mm/Nav";
import Footer from "./components/Footer";
import Resto from "./pages/Resto_Menu";
import Contact from "./pages/Contact";
import { CartProvider } from "./context/CartContext";
import Reservation from "./pages/Reservation";
import Dashboard from "./pages/Livreur";
import Restaurent from "./pages/Restaurent";
import Cafe_Menu from "./pages/Cafe_Menu";
import Home from "./pages/Home";
import Partner from "./pages/partner";
import Login from "./pages/Login";
import Livreure from "./pages/lelivreur";
import Signup from "./pages/Signup";
import Admin from "./pages/adminpage";
import { SelectedRestaurantProvider } from "./context/SelectedRestaurantContext";
import AppLivreur from "./pages/livreur/AppLivreur";
import DashboardResto from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import AiAssetente from "./components/Ai-Assetente";

function App() {
  const location = useLocation();
  
  // Logic to determine if we are in a dashboard/special layout
  const isSpecialPage = 
    location.pathname.startsWith("/adminpage") || 
    location.pathname.startsWith("/livreur") || 
    location.pathname.startsWith("/Dashboardpartner");

  return (
    <CartProvider>
      <SelectedRestaurantProvider>
        <div className="flex min-h-screen flex-col">
          {/* Only show Nav if not in Admin/Livreur/Partner panels */}
          {!isSpecialPage && <Nav />}

          <main className={`flex-grow ${!isSpecialPage ? "container mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/lelivreur" element={<Livreure />} />

              {/* Client routes */}
              <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
                <Route path="/Resto" element={<Restaurent />} />
                <Route path="/Resto/:id" element={<Resto />} />
                <Route path="/Cafe" element={<Cafe />} />
                <Route path="/Cafe/:id" element={<Cafe_Menu />} />
                <Route path="/reservation/:id" element={<Reservation />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={["admingobite"]} />}>
                <Route path="/adminpage/*" element={<Admin />} />
              </Route>

              {/* Partner routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/Dashboardpartner/*" element={<DashboardResto />} />
              </Route>

              {/* Livreur routes */}
              <Route element={<ProtectedRoute allowedRoles={["rider"]} />}>
                <Route path="/livreur/*" element={<AppLivreur />} />
              </Route>
            </Routes>
          </main>

          {/* Assistant and Footer visibility */}
          {!isSpecialPage && (
            <>
              <AiAssetente />
              <Footer />
            </>
          )}
        </div>
      </SelectedRestaurantProvider>
    </CartProvider>
  );
}

export default App;