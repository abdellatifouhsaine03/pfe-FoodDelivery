import { useLocation } from "react-router-dom";
import Sidebar from "./../components/admin/Sidebar";
import Header from "./../components/admin/Header";
import PartnershipRequests from "./../components/admin/PartnershipRequests";
import RiderApplications from "./../components/admin/riders";
import RestaurantApplications from "./../components/admin/restaurent";

function Admin() {
  const location = useLocation();
  const admin = location.pathname;

  return (
    /* h-screen + overflow-hidden: Essential to stop the whole page from scrolling */
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans">
      
      {/* Sidebar: Fixed width, won't shrink, stays on the left */}
      <div className="w-72 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Section: Calculates remaining width */}
      <div className="flex flex-1 flex-col min-w-0 bg-slate-50">
        
        {/* Header: Locked at the top */}
        <Header />

        {/* Content Viewport: This is the ONLY scrollable area.
            Padding (p-8) and Max-Width keep it professional.
        */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="mx-auto max-w-[1400px]">
            
            {/* Navigation Security Logic (Conditional Rendering) */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {(admin === '/adminpage/' || admin === '/adminpage') && (
                <PartnershipRequests />
              )}
              
              {admin === '/adminpage/riders' && (
                <RiderApplications />
              )}
              
              {admin === '/adminpage/restaurants' && (
                <RestaurantApplications />
              )}
            </div>

          </div>
        </main>
        
      </div>
    </div>
  );
}

export default Admin;