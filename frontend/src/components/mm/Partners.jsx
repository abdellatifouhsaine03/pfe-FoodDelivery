import { useNavigate } from "react-router-dom";
import png17 from "./17.png";
import png21 from "./21.webp";

const Partners = () => {
  const navigate = useNavigate();

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold">Be Partner with Us</h2>
      <br />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Restaurant Partner Card */}
        <div 
          className="relative h-[280px] md:h-[280px] sm:h-[180px] rounded-xl overflow-hidden bg-cover bg-center text-white cursor-pointer group"
          style={{ backgroundImage: `url(${png17})` }}
          onClick={() => navigate('/partner')}
        >
          <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-2xl mb-[15px] font-semibold">Partner with us</h2>
            <button className="bg-[#00a651] hover:bg-[#008c44] text-white border-none rounded-md px-5 py-2.5 font-medium transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>

        {/* Rider Partner Card */}
        <div 
          className="relative h-[280px] md:h-[280px] sm:h-[180px] rounded-xl overflow-hidden bg-cover bg-center text-white cursor-pointer group"
          style={{ backgroundImage: `url(${png21})` }}
          onClick={() => navigate('/lelivreur')}
        >
          <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-2xl mb-[15px] font-semibold">Ride with us</h2>
            <button className="bg-[#00a651] hover:bg-[#008c44] text-white border-none rounded-md px-5 py-2.5 font-medium transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Partners;