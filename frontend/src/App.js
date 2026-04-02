import { Routes, Route, useLocation } from "react-router-dom";
import Cafe from "./pages/Cafe";
import "./App.css";
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
import { DashboardView } from "./pages/livreur/Views/DashboardView";
import DashboardResto from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import AiAssetente from "./components/Ai-Assetente";



function App() {
  const location = useLocation();
  const admin = location.pathname.startsWith("/adminpage");
  const livreur = location.pathname.startsWith("/livreur");
  const partner = location.pathname.startsWith("/Dashboardpartner");

  return (
    <CartProvider>
      <SelectedRestaurantProvider>
        <div className="app">
          {!admin && !livreur && !partner && <Nav />}
          <main className="main-content">
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
                <Route path="/adminpage" element={<Admin />} />
                <Route path="/adminpage/riders" element={<Admin />} />
                <Route path="/adminpage/restaurants" element={<Admin />} />
              </Route>

              {/* Partnerroutes */}
              <Route
                element={<ProtectedRoute allowedRoles={["admin"]} />}
              >
                <Route
                  path="/Dashboardpartner/*"
                  element={<DashboardResto />}
                />
              </Route>

              {/* Livreur routes */}
              <Route element={<ProtectedRoute allowedRoles={["rider"]} />}>
                <Route path="/livreur/*" element={<AppLivreur />} />
              </Route>
            </Routes>
            {!admin && !livreur && !partner && <AiAssetente />}
          </main>
          {!admin && !livreur && !partner && <Footer />}
        </div>
      </SelectedRestaurantProvider>
    </CartProvider>
  );
}

export default App;
