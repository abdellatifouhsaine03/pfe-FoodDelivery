import React from "react";

const MapSection = () => {
  return (
    <div className="group relative h-full min-h-[300px] w-full overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl">
      {/* 1. THE MAP BACKGROUND */}
      <div className="absolute inset-0 h-full w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528082187!2d-74.11976373946229!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1647450000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Restaurant Location"
          className="h-full w-full grayscale contrast-[1.2] invert-[0.05] transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100"
        ></iframe>
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. FLOATING INFO CARD (GLASSMORPHISM) */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl overflow-hidden">
          
          {/* Main Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Pizza Hut HQ</h3>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex text-orange-500">
                {"★".repeat(4)}<span className="text-gray-600">★</span>
              </div>
              <span>•</span>
              <span>484 Reviews</span>
              <span>•</span>
              <span className="text-white">$$</span>
            </div>

            <p className="text-sm text-gray-300 font-medium leading-tight pt-1">
              123 Main Street, New York, NY 10001
            </p>
          </div>

          {/* Action Button */}
          <a
            href="https://goo.gl/maps/123"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <span>Navigate</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M17.5 2L23 7.5L17.5 13M23 7.5H12C7 7.5 3 11.5 3 16.5V22"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* 3. STATUS TAG (TOP RIGHT) */}
      <div className="absolute top-6 right-6">
        <div className="bg-white px-4 py-2 rounded-full shadow-xl">
           <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">Open Until 11:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default MapSection;